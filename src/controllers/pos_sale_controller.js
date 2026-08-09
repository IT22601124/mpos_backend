import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {
  sequelize,
  Sequelize,
  PosSale,
  PosSaleItem,
  PosSalePayment,
  PosRegisterSession,
  Product,
  Category,
  Customer,
  BackendUser,
  Role,
  StockMovement,
  CustomerCreditTransaction,
  StoreProfile
} = require('../../models/index.js');

const { Op } = Sequelize;

const saleInclude = () => [
  { model: Customer, as: 'customer' },
  { model: BackendUser, as: 'cashier', attributes: ['id', 'name', 'email', 'phone'] },
  { model: PosRegisterSession, as: 'register_session' },
  {
    model: PosSaleItem,
    as: 'items',
    include: [{ model: Product, as: 'product' }]
  },
  { model: PosSalePayment, as: 'payments' }
];

const toNumber = (value) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const roundMoney = (value) => Number((Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2));

const dateKey = (value) => {
  const date = value ? new Date(value) : new Date();
  return date.toISOString().slice(0, 10);
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const lastSevenDaysRange = () => {
  const end = new Date();
  const start = addDays(end, -6);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const resolveSevenDayRange = (query = {}) => {
  if (query.from && query.to) {
    return { start: new Date(query.from), end: new Date(query.to) };
  }

  if (query.from) {
    const start = new Date(query.from);
    return { start, end: addDays(start, 6) };
  }

  if (query.to) {
    const end = new Date(query.to);
    return { start: addDays(end, -6), end };
  }

  return lastSevenDaysRange();
};

const requestError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeItems = (items = []) => items.map((rawItem) => {
  const item = { ...rawItem, qty: rawItem.qty ?? rawItem.quantity };
  if (!item.product_id) {
    throw requestError('Every sale item must have product_id');
  }

  ['qty', 'unit_price', 'line_total'].forEach((field) => {
    if (item[field] === undefined || item[field] === null || item[field] === '') {
      throw requestError(`Every sale item must have ${field}`);
    }
  });

  const qty = toNumber(item.qty);
  const unitPrice = toNumber(item.unit_price);
  const discount = toNumber(item.discount ?? item.discount_amount);
  const tax = toNumber(item.tax ?? item.tax_amount);
  const lineTotal = item.line_total === undefined
    ? roundMoney((qty * unitPrice) - discount + tax)
    : roundMoney(toNumber(item.line_total));
  if (qty <= 0) {
    throw requestError('Sale item qty must be greater than zero');
  }

  if (unitPrice < 0 || lineTotal < 0) {
    throw requestError('Sale item prices and totals cannot be negative');
  }

  return {
    product_id: item.product_id,
    variant_id: item.variant_id || null,
    qty,
    unit_price: unitPrice,
    discount,
    tax,
    line_total: lineTotal
  };
});

const calculateTotals = (items, payments = []) => {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + (toNumber(item.qty) * toNumber(item.unit_price)), 0));
  const discountTotal = roundMoney(items.reduce((sum, item) => sum + toNumber(item.discount), 0));
  const taxTotal = roundMoney(items.reduce((sum, item) => sum + toNumber(item.tax), 0));
  const grandTotal = roundMoney(items.reduce((sum, item) => sum + toNumber(item.line_total), 0));
  const paidAmount = roundMoney(payments.reduce((sum, payment) => sum + toNumber(payment.amount), 0));

  return {
    subtotal,
    discount_total: discountTotal,
    tax_total: taxTotal,
    grand_total: grandTotal,
    paid_amount: paidAmount,
    balance_amount: roundMoney(grandTotal - paidAmount)
  };
};

const isUserAdmin = (user) => {
  if (!user) return true;
  if (user.role_id === 1 || user.role_id === '1') return true;
  if (user.role_name && String(user.role_name).toLowerCase().includes('admin')) return true;
  return false;
};

const buildSaleWhere = (query = {}, reqUser = null) => {
  const where = {};

  ['status', 'customer_id', 'cashier_id', 'register_session_id', 'register_no', 'shift_no', 'sale_no'].forEach((field) => {
    if (query[field] !== undefined && query[field] !== '') {
      where[field] = query[field];
    }
  });

  const isAdmin = isUserAdmin(reqUser);

  if (!isAdmin && reqUser && reqUser.id) {
    where.cashier_id = reqUser.id;
  } else if (isAdmin) {
    if (query.scope === 'own' && reqUser && reqUser.id) {
      where.cashier_id = reqUser.id;
    }
  }

  if (query.from || query.to) {
    where.sold_at = {};
    if (query.from) {
      where.sold_at[Op.gte] = new Date(query.from);
    }
    if (query.to) {
      const toDate = new Date(query.to);
      if (typeof query.to === 'string' && query.to.length <= 10) {
        toDate.setHours(23, 59, 59, 999);
      }
      where.sold_at[Op.lte] = toDate;
    }
  }

  return where;
};

const reportSaleWhere = (query, reqUser = null) => ({
  ...buildSaleWhere(query, reqUser),
  status: query.status || 'completed'
});

const paymentKey = (method) => String(method || '').toLowerCase();

const paymentLabel = (method) => {
  const labels = {
    cash: 'Cash',
    card: 'Card',
    bank_transfer: 'Bank Transfer',
    credit: 'Credit',
    mobile: 'Mobile',
    voucher: 'Voucher',
    mixed: 'Mixed'
  };

  return labels[paymentKey(method)] || method || 'Unknown';
};

const paymentAmountExplicit = (sale, method) => roundMoney((sale.payments || [])
  .filter((payment) => paymentKey(payment.method) === method)
  .reduce((sum, payment) => sum + toNumber(payment.amount), 0));

const paymentAmount = (sale, method) => {
  const targetKey = paymentKey(method);
  const explicit = paymentAmountExplicit(sale, targetKey);

  if (explicit > 0) {
    return explicit;
  }

  if (targetKey === 'credit') {
    const grandTotal = toNumber(sale.grand_total);
    const paidAmount = toNumber(sale.paid_amount);
    if (paidAmount < grandTotal) {
      return Math.max(roundMoney(grandTotal - paidAmount), 0);
    }
    return 0;
  }

  if (targetKey === 'cash') {
    const totalNonCredit = nonCreditPaidAmountForSale(sale);
    const otherNonCash = paymentAmountExplicit(sale, 'card') +
      paymentAmountExplicit(sale, 'bank_transfer') +
      paymentAmountExplicit(sale, 'mobile') +
      paymentAmountExplicit(sale, 'voucher');

    return Math.max(roundMoney(totalNonCredit - otherNonCash), 0);
  }

  return 0;
};

const creditAmountForSale = (sale) => {
  const creditPayment = paymentAmount(sale, 'credit');
  if (creditPayment > 0) {
    return creditPayment;
  }

  const grandTotal = toNumber(sale.grand_total);
  const paidAmount = toNumber(sale.paid_amount);
  if (paidAmount < grandTotal) {
    return Math.max(roundMoney(grandTotal - paidAmount), 0);
  }

  return 0;
};

const nonCreditPaidAmountForSale = (sale) => {
  const nonCreditSum = roundMoney((sale.payments || [])
    .filter((payment) => paymentKey(payment.method) !== 'credit')
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0));

  if (nonCreditSum > 0) {
    return nonCreditSum;
  }

  const paidAmount = toNumber(sale.paid_amount);
  if (paidAmount > 0) {
    return roundMoney(paidAmount);
  }

  const creditAmount = paymentAmount(sale, 'credit');
  if (creditAmount > 0) {
    return Math.max(roundMoney(toNumber(sale.grand_total) - creditAmount), 0);
  }

  return 0;
};

const unitsSoldForSale = (sale) => roundMoney((sale.items || [])
  .reduce((sum, item) => sum + toNumber(item.qty), 0));

const getPaymentMethodLabel = (sale) => {
  const payments = sale.payments || [];

  if (payments.length > 1) {
    return 'Mixed';
  }

  return payments.length ? paymentLabel(payments[0].method) : 'Unpaid';
};

const buildPublicUrl = (req, value) => {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value) || /^data:image\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;

  return `${req.protocol}://${req.get('host')}${normalizedPath}`;
};

const serializeStoreProfile = (req, profile) => {
  if (!profile) {
    return null;
  }

  const data = profile.toJSON ? profile.toJSON() : profile;

  return {
    ...data,
    logo_url: buildPublicUrl(req, data.logo)
  };
};

const mapRecentSale = (sale) => {
  const totalAmount = toNumber(sale.grand_total);
  const creditAmount = creditAmountForSale(sale);
  const paidAmount = nonCreditPaidAmountForSale(sale);
  const amountDueNow = roundMoney(totalAmount - creditAmount);

  return {
    id: sale.id,
    sale_no: sale.sale_no,
    sold_at: sale.sold_at,
    created_at: sale.created_at,
    customer_name: sale.customer ? sale.customer.name : 'Walk-in customer',
    cashier_id: sale.cashier_id,
    cashier_name: sale.cashier ? sale.cashier.name : null,
    payment_method: getPaymentMethodLabel(sale),
    subtotal: toNumber(sale.subtotal),
    discount_amount: toNumber(sale.discount_total),
    tax_amount: toNumber(sale.tax_total),
    total_amount: totalAmount,
    paid_amount: paidAmount,
    collected: paidAmount,
    change_amount: Math.max(roundMoney(paidAmount - amountDueNow), 0),
    credit_amount: creditAmount,
    credit_due: creditAmount,
    status: sale.status
  };
};

const buildDailyTotals = (sales, fromDate, toDate) => {
  const totals = new Map();
  const start = new Date(fromDate);
  const end = new Date(toDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  for (let cursor = new Date(start); cursor <= end; cursor = addDays(cursor, 1)) {
    totals.set(dateKey(cursor), {
      date: dateKey(cursor),
      total_sales: 0,
      net_sales: 0,
      collected: 0,
      credit_due: 0,
      items_sold: 0,
      bill_count: 0
    });
  }

  sales.forEach((sale) => {
    const key = dateKey(sale.sold_at || sale.created_at);
    const existing = totals.get(key) || {
      date: key,
      total_sales: 0,
      net_sales: 0,
      collected: 0,
      credit_due: 0,
      items_sold: 0,
      bill_count: 0
    };

    const totalSales = toNumber(sale.grand_total);
    const collected = nonCreditPaidAmountForSale(sale);
    const creditDue = creditAmountForSale(sale);

    existing.total_sales = roundMoney(existing.total_sales + totalSales);
    existing.net_sales = roundMoney(existing.net_sales + totalSales);
    existing.collected = roundMoney(existing.collected + collected);
    existing.credit_due = roundMoney(existing.credit_due + creditDue);
    existing.items_sold = roundMoney(existing.items_sold + unitsSoldForSale(sale));
    existing.bill_count += 1;

    totals.set(key, existing);
  });

  return Array.from(totals.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const applyDashboardAliases = (summary, targetValue = 0) => {
  const todayTarget = toNumber(targetValue);
  const netSales = toNumber(summary.total_sales);

  return {
    ...summary,
    net_sales: netSales,
    collected: toNumber(summary.paid_amount),
    credit_due: toNumber(summary.credit_amount),
    items_sold: toNumber(summary.units_sold),
    today_target: todayTarget,
    target_progress: todayTarget > 0 ? roundMoney((netSales / todayTarget) * 100) : 0
  };
};

const saleReportInclude = () => [
  { model: Customer, as: 'customer' },
  {
    model: BackendUser,
    as: 'cashier',
    attributes: ['id', 'name', 'email', 'phone', 'role_id'],
    include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }]
  },
  { model: PosSalePayment, as: 'payments' },
  { model: PosSaleItem, as: 'items' }
];

const fetchReportSales = (query, reqUser = null, include = saleReportInclude()) => PosSale.findAll({
  where: reportSaleWhere(query, reqUser),
  include,
  order: [['sold_at', 'DESC'], ['id', 'DESC']]
});

const getSalesForLastSevenDays = (query = {}, reqUser = null) => {
  const { start, end } = lastSevenDaysRange();

  return fetchReportSales({
    ...query,
    from: query.from || start.toISOString(),
    to: query.to || end.toISOString()
  }, reqUser);
};

const emptySummaryReport = () => ({
  total_sales: 0,
  bill_count: 0,
  units_sold: 0,
  average_bill: 0,
  paid_amount: 0,
  credit_amount: 0,
  tax_amount: 0,
  discount_amount: 0,
  cash_sales: 0,
  card_sales: 0,
  credit_sales: 0
});

const generateSaleNo = async (transaction) => {
  const maxId = await PosSale.max('id', {
    transaction
  });

  return `SALE-${String(toNumber(maxId) + 1).padStart(6, '0')}`;
};

const createStockMovements = async (sale, items, transaction, type = 'sale') => {
  const quantitySign = type === 'sale' ? -1 : 1;

  await Promise.all(items.map((item) => Product.increment(
    { stock_quantity: quantitySign * toNumber(item.qty) },
    {
      where: { id: item.product_id },
      transaction
    }
  )));

  await StockMovement.bulkCreate(items.map((item) => ({
    product_id: item.product_id,
    type,
    quantity: item.qty,
    reference_id: sale.id,
    remarks: `${type === 'sale' ? 'POS sale' : 'POS sale reversal'} ${sale.sale_no}`,
    created_by: sale.cashier_id
  })), { transaction });
};

const applyCreditPayments = async (sale, payments, transaction, direction = 1) => {
  let creditAmount = roundMoney(payments
    .filter((payment) => paymentKey(payment.method) === 'credit')
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0));

  const grandTotal = toNumber(sale.grand_total);
  const paidAmount = nonCreditPaidAmountForSale(sale);
  if (grandTotal > 0) {
    const maxCredit = Math.max(roundMoney(grandTotal - paidAmount), 0);
    if (!creditAmount || creditAmount > maxCredit) {
      creditAmount = maxCredit;
    }
  }

  if (!creditAmount || !sale.customer_id) {
    return;
  }

  await Customer.increment(
    { current_balance: direction * creditAmount },
    {
      where: { id: sale.customer_id },
      transaction
    }
  );

  await CustomerCreditTransaction.create({
    customer_id: sale.customer_id,
    type: direction > 0 ? 'credit_sale' : 'adjustment',
    amount: direction > 0 ? creditAmount : -creditAmount,
    reference_id: sale.id,
    remarks: direction > 0 ? `POS credit sale ${sale.sale_no}` : `POS credit reversal ${sale.sale_no}`
  }, { transaction });
};

const applyCompletedSaleEffects = async (sale, items, payments, transaction) => {
  await createStockMovements(sale, items, transaction, 'sale');
  await applyCreditPayments(sale, payments, transaction, 1);
};

const reverseCompletedSaleEffects = async (sale, transaction) => {
  const items = await PosSaleItem.findAll({ where: { sale_id: sale.id }, transaction });
  const payments = await PosSalePayment.findAll({ where: { sale_id: sale.id }, transaction });

  await createStockMovements(sale, items, transaction, 'return');
  await applyCreditPayments(sale, payments, transaction, -1);
};

export const createPosSale = async (req, res) => {
  try {
    const allowedStatuses = ['held', 'completed'];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      throw requestError('Sale can only be created as held or completed');
    }

    const sale = await sequelize.transaction(async (transaction) => {
      const items = normalizeItems(req.body.items);
      let payments = req.body.payments || [];

      if (!items.length) {
        throw requestError('At least one sale item is required');
      }

      if (!Array.isArray(payments)) {
        throw requestError('Payments must be an array');
      }

      const reqPaidAmount = req.body.paid_amount !== undefined ? toNumber(req.body.paid_amount) : null;
      const reqCreditAmount = req.body.credit_amount !== undefined ? toNumber(req.body.credit_amount) : null;

      const hasCreditPayment = payments.some((p) => paymentKey(p.method) === 'credit');
      const hasNonCreditPayment = payments.some((p) => paymentKey(p.method) !== 'credit');

      if (reqPaidAmount !== null && reqPaidAmount > 0 && !hasNonCreditPayment && (hasCreditPayment || reqCreditAmount > 0)) {
        const defaultMethod = req.body.payment_method && paymentKey(req.body.payment_method) !== 'credit'
          ? req.body.payment_method.toLowerCase()
          : 'cash';
        payments.unshift({ method: defaultMethod, amount: reqPaidAmount });
      }

      if (!hasCreditPayment && reqCreditAmount !== null && reqCreditAmount > 0) {
        payments.push({ method: 'credit', amount: reqCreditAmount });
      }

      const totals = calculateTotals(items, payments);
      const grandTotal = req.body.grand_total ?? req.body.total_amount ?? totals.grand_total;

      let finalPaidAmount = reqPaidAmount !== null
        ? reqPaidAmount
        : (hasCreditPayment || reqCreditAmount > 0
            ? nonCreditPaidAmountForSale({ payments, grand_total: grandTotal })
            : totals.paid_amount);

      if ((hasCreditPayment || reqCreditAmount > 0) && finalPaidAmount >= grandTotal) {
        const creditAmt = reqCreditAmount !== null ? reqCreditAmount : paymentAmount({ payments }, 'credit');
        if (creditAmt > 0) {
          finalPaidAmount = Math.max(roundMoney(grandTotal - creditAmt), 0);
        }
      }

      const saleStatus = req.body.status || 'completed';
      const saleRecord = await PosSale.create({
        sale_no: req.body.sale_no || await generateSaleNo(transaction),
        customer_id: req.body.customer_id || null,
        cashier_id: req.body.cashier_id || (req.user ? req.user.id : null),
        register_session_id: req.body.register_session_id || null,
        register_no: req.body.register_no || null,
        shift_no: req.body.shift_no || null,
        subtotal: req.body.subtotal ?? totals.subtotal,
        discount_total: req.body.discount_total ?? req.body.discount_amount ?? totals.discount_total,
        tax_total: req.body.tax_total ?? req.body.tax_amount ?? totals.tax_total,
        grand_total: grandTotal,
        paid_amount: finalPaidAmount,
        balance_amount: Math.max(roundMoney(grandTotal - finalPaidAmount), 0),
        status: saleStatus,
        sold_at: req.body.sold_at || new Date(),
        notes: req.body.notes || null
      }, { transaction });

      const itemRecords = await PosSaleItem.bulkCreate(
        items.map((item) => ({ ...item, sale_id: saleRecord.id })),
        { transaction }
      );

      const paymentRecords = await PosSalePayment.bulkCreate(
        payments.map((payment) => ({
          sale_id: saleRecord.id,
          method: payment.method,
          amount: toNumber(payment.amount),
          reference_no: payment.reference_no || null
        })),
        { transaction }
      );

      if (saleStatus === 'completed') {
        await applyCompletedSaleEffects(saleRecord, itemRecords, paymentRecords, transaction);
      }

      return saleRecord;
    });

    const saleWithDetails = await PosSale.findByPk(sale.id, { include: saleInclude() });
    res.status(201).json({ success: true, pos_sale: saleWithDetails });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getAllPosSales = async (req, res) => {
  try {
    const sales = await PosSale.findAll({
      where: buildSaleWhere(req.query, req.user),
      include: saleInclude(),
      order: [['sold_at', 'DESC'], ['id', 'DESC']]
    });

    res.json({ success: true, pos_sales: sales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosSaleById = async (req, res) => {
  try {
    const sale = await PosSale.findByPk(req.params.id, { include: saleInclude() });

    if (!sale) {
      return res.status(404).json({ error: 'pos_sale not found' });
    }

    res.json({ success: true, pos_sale: sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePosSaleStatus = async (req, res) => {
  try {
    const allowedStatuses = ['held', 'completed', 'voided', 'refunded'];
    const nextStatus = req.body.status;

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ error: 'Invalid sale status' });
    }

    const sale = await sequelize.transaction(async (transaction) => {
      const saleRecord = await PosSale.findByPk(req.params.id, { transaction });

      if (!saleRecord) {
        return null;
      }

      const previousStatus = saleRecord.status;

      if (previousStatus === nextStatus) {
        return saleRecord;
      }

      if (['voided', 'refunded'].includes(previousStatus)) {
        throw requestError('Voided or refunded sales cannot be changed');
      }

      if (previousStatus === 'completed' && nextStatus === 'held') {
        throw requestError('Completed sales cannot be moved back to held');
      }

      if (previousStatus === 'held' && nextStatus !== 'completed') {
        throw requestError('Held sales can only be completed');
      }

      if (previousStatus === 'held' && nextStatus === 'completed') {
        const items = await PosSaleItem.findAll({ where: { sale_id: saleRecord.id }, transaction });
        const payments = await PosSalePayment.findAll({ where: { sale_id: saleRecord.id }, transaction });
        await applyCompletedSaleEffects(saleRecord, items, payments, transaction);
      }

      if (['completed'].includes(previousStatus) && ['voided', 'refunded'].includes(nextStatus)) {
        await reverseCompletedSaleEffects(saleRecord, transaction);
      }

      await saleRecord.update({
        status: nextStatus,
        notes: req.body.notes ?? saleRecord.notes
      }, { transaction });

      return saleRecord;
    });

    if (!sale) {
      return res.status(404).json({ error: 'pos_sale not found' });
    }

    const saleWithDetails = await PosSale.findByPk(sale.id, { include: saleInclude() });
    res.json({ success: true, pos_sale: saleWithDetails });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const deletePosSale = async (req, res) => {
  try {
    const deleted = await sequelize.transaction(async (transaction) => {
      const sale = await PosSale.findByPk(req.params.id, { transaction });

      if (!sale) {
        return null;
      }

      if (sale.status !== 'held') {
        throw requestError('Only held orders can be deleted');
      }

      await PosSalePayment.destroy({
        where: { sale_id: sale.id },
        transaction
      });

      await PosSaleItem.destroy({
        where: { sale_id: sale.id },
        transaction
      });

      await sale.destroy({ transaction });

      return sale;
    });

    if (!deleted) {
      return res.status(404).json({ error: 'pos_sale not found' });
    }

    res.json({
      success: true,
      message: 'Held order deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const updatePosSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    const sale = await sequelize.transaction(async (transaction) => {
      const saleRecord = await PosSale.findByPk(saleId, { transaction });
      if (!saleRecord) return null;

      const updates = {};
      if (req.body.customer_id !== undefined) updates.customer_id = req.body.customer_id || null;
      if (req.body.notes !== undefined) updates.notes = req.body.notes;
      if (req.body.status !== undefined && ['completed', 'held', 'voided', 'refunded'].includes(req.body.status)) {
        updates.status = req.body.status;
      }
      if (req.body.paid_amount !== undefined) updates.paid_amount = toNumber(req.body.paid_amount);
      if (req.body.grand_total !== undefined) {
        updates.grand_total = toNumber(req.body.grand_total);
        const paid = updates.paid_amount !== undefined ? updates.paid_amount : toNumber(saleRecord.paid_amount);
        updates.balance_amount = Math.max(roundMoney(updates.grand_total - paid), 0);
      }

      await saleRecord.update(updates, { transaction });

      if (req.body.payment_method) {
        const payments = await PosSalePayment.findAll({ where: { sale_id: saleRecord.id }, transaction });
        if (payments.length > 0) {
          await payments[0].update({ method: req.body.payment_method.toLowerCase() }, { transaction });
        }
      }

      return saleRecord;
    });

    if (!sale) {
      return res.status(404).json({ error: 'pos_sale not found' });
    }

    const saleWithDetails = await PosSale.findByPk(sale.id, { include: saleInclude() });
    res.json({ success: true, pos_sale: saleWithDetails });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getPosSalesSummaryReport = async (req, res) => {
  try {
    const sales = await fetchReportSales(req.query, req.user);
    const summary = sales.reduce((totals, sale) => {
      const totalSales = toNumber(sale.grand_total);
      const creditAmount = creditAmountForSale(sale);

      totals.total_sales = roundMoney(totals.total_sales + totalSales);
      totals.bill_count += 1;
      totals.units_sold = roundMoney(totals.units_sold + unitsSoldForSale(sale));
      totals.paid_amount = roundMoney(totals.paid_amount + nonCreditPaidAmountForSale(sale));
      totals.credit_amount = roundMoney(totals.credit_amount + creditAmount);
      totals.tax_amount = roundMoney(totals.tax_amount + toNumber(sale.tax_total));
      totals.discount_amount = roundMoney(totals.discount_amount + toNumber(sale.discount_total));
      totals.cash_sales = roundMoney(totals.cash_sales + paymentAmount(sale, 'cash'));
      totals.card_sales = roundMoney(totals.card_sales + paymentAmount(sale, 'card'));
      totals.credit_sales = roundMoney(totals.credit_sales + creditAmount);
      return totals;
    }, emptySummaryReport());

    summary.average_bill = summary.bill_count
      ? roundMoney(summary.total_sales / summary.bill_count)
      : 0;

    res.json(applyDashboardAliases(summary, req.query.today_target));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosSalesReport = async (req, res) => {
  try {
    const hasDateRange = req.query.from || req.query.to;
    const range = resolveSevenDayRange(req.query);
    const sales = hasDateRange ? await fetchReportSales(req.query, req.user) : await getSalesForLastSevenDays(req.query, req.user);
    const mappedSales = sales.map(mapRecentSale);

    res.json({
      daily_totals: buildDailyTotals(sales, range.start, range.end),
      recent_sales: mappedSales.slice(0, toNumber(req.query.recent_limit) || 10),
      sales: mappedSales
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosSalesCashiersReport = async (req, res) => {
  try {
    const sales = await fetchReportSales(req.query, req.user);
    const cashierMap = new Map();

    sales.forEach((sale) => {
      const cashierId = sale.cashier_id || 0;
      const existing = cashierMap.get(cashierId) || {
        cashier_id: sale.cashier_id,
        cashier_name: sale.cashier ? sale.cashier.name : null,
        bill_count: 0,
        units_sold: 0,
        total_sales: 0,
        cash_sales: 0,
        card_sales: 0,
        credit_sales: 0,
        collected: 0,
        credit: 0,
        discount_amount: 0,
        tax_amount: 0,
        average_bill: 0,
        role: sale.cashier && sale.cashier.role ? sale.cashier.role.name : null
      };

      existing.bill_count += 1;
      existing.units_sold = roundMoney(existing.units_sold + unitsSoldForSale(sale));
      existing.total_sales = roundMoney(existing.total_sales + toNumber(sale.grand_total));
      existing.cash_sales = roundMoney(existing.cash_sales + paymentAmount(sale, 'cash'));
      existing.card_sales = roundMoney(existing.card_sales + paymentAmount(sale, 'card'));
      existing.credit_sales = roundMoney(existing.credit_sales + creditAmountForSale(sale));
      existing.collected = roundMoney(existing.collected + nonCreditPaidAmountForSale(sale));
      existing.credit = existing.credit_sales;
      existing.discount_amount = roundMoney(existing.discount_amount + toNumber(sale.discount_total));
      existing.tax_amount = roundMoney(existing.tax_amount + toNumber(sale.tax_total));
      existing.average_bill = existing.bill_count
        ? roundMoney(existing.total_sales / existing.bill_count)
        : 0;

      cashierMap.set(cashierId, existing);
    });

    res.json({ cashiers: Array.from(cashierMap.values()) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardReport = async (req, res) => {
  try {
    const sales = await getSalesForLastSevenDays(req.query, req.user);
    const summary = sales.reduce((totals, sale) => {
      const totalSales = toNumber(sale.grand_total);
      const creditAmount = creditAmountForSale(sale);

      totals.total_sales = roundMoney(totals.total_sales + totalSales);
      totals.bill_count += 1;
      totals.units_sold = roundMoney(totals.units_sold + unitsSoldForSale(sale));
      totals.paid_amount = roundMoney(totals.paid_amount + nonCreditPaidAmountForSale(sale));
      totals.credit_amount = roundMoney(totals.credit_amount + creditAmount);
      totals.tax_amount = roundMoney(totals.tax_amount + toNumber(sale.tax_total));
      totals.discount_amount = roundMoney(totals.discount_amount + toNumber(sale.discount_total));
      totals.cash_sales = roundMoney(totals.cash_sales + paymentAmount(sale, 'cash'));
      totals.card_sales = roundMoney(totals.card_sales + paymentAmount(sale, 'card'));
      totals.credit_sales = roundMoney(totals.credit_sales + creditAmount);
      return totals;
    }, emptySummaryReport());

    summary.average_bill = summary.bill_count
      ? roundMoney(summary.total_sales / summary.bill_count)
      : 0;

    const cashierMap = new Map();
    sales.forEach((sale) => {
      const cashierId = sale.cashier_id || 0;
      const existing = cashierMap.get(cashierId) || {
        cashier_id: sale.cashier_id,
        cashier_name: sale.cashier ? sale.cashier.name : null,
        role: sale.cashier && sale.cashier.role ? sale.cashier.role.name : null,
        total_sales: 0,
        collected: 0,
        credit: 0,
        bill_count: 0
      };

      existing.total_sales = roundMoney(existing.total_sales + toNumber(sale.grand_total));
      existing.collected = roundMoney(existing.collected + nonCreditPaidAmountForSale(sale));
      existing.credit = roundMoney(existing.credit + creditAmountForSale(sale));
      existing.bill_count += 1;

      cashierMap.set(cashierId, existing);
    });

    const { start, end } = lastSevenDaysRange();
    const profile = await StoreProfile.findOne({ order: [['id', 'ASC']] });
    const mappedSales = sales.map(mapRecentSale);

    res.json({
      success: true,
      metrics: applyDashboardAliases(summary, req.query.today_target),
      chart: buildDailyTotals(sales, start, end),
      cashier_summaries: Array.from(cashierMap.values()),
      recent_sales: mappedSales.slice(0, toNumber(req.query.recent_limit) || 10),
      store_profile: serializeStoreProfile(req, profile)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPosSalesProductsReport = async (req, res) => {
  try {
    const sales = await fetchReportSales(req.query, req.user, [
      {
        model: PosSaleItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            include: [{ model: Category, as: 'category' }]
          }
        ]
      }
    ]);
    const productMap = new Map();

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const productId = String(item.product_id);
        const existing = productMap.get(productId) || {
          product_id: item.product_id,
          product_name: item.product ? item.product.name : null,
          product_code: item.product ? item.product.product_code : null,
          category_name: item.product && item.product.category ? item.product.category.name : null,
          quantity_sold: 0,
          gross_sales: 0,
          discount_amount: 0,
          tax_amount: 0,
          net_sales: 0
        };
        const qty = toNumber(item.qty);

        existing.quantity_sold = roundMoney(existing.quantity_sold + qty);
        existing.gross_sales = roundMoney(existing.gross_sales + (qty * toNumber(item.unit_price)));
        existing.discount_amount = roundMoney(existing.discount_amount + toNumber(item.discount));
        existing.tax_amount = roundMoney(existing.tax_amount + toNumber(item.tax));
        existing.net_sales = roundMoney(existing.net_sales + toNumber(item.line_total));

        productMap.set(productId, existing);
      });
    });

    res.json({ products: Array.from(productMap.values()) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosSalesItemsReport = getPosSalesProductsReport;

export const getPosSalesInventoryReport = async (req, res) => {
  try {
    const productWhere = {};
    const movementWhere = {};

    if (req.query.product_id) {
      productWhere.id = req.query.product_id;
      movementWhere.product_id = req.query.product_id;
    }

    if (req.query.movement_type) {
      movementWhere.type = req.query.movement_type;
    }

    const products = await Product.findAll({
      where: productWhere,
      include: [{ model: Category, as: 'category' }],
      order: [['name', 'ASC']]
    });
    const movements = await StockMovement.findAll({
      where: movementWhere,
      include: [{ model: Product, as: 'product' }],
      order: [['created_at', 'DESC'], ['id', 'DESC']]
    });

    res.json({
      inventory: products.map((product) => ({
        product_id: product.id,
        product_name: product.name,
        product_code: product.product_code,
        current_stock: toNumber(product.stock_quantity),
        minimum_stock: toNumber(product.minimum_stock),
        stock_value: roundMoney(toNumber(product.stock_quantity) * toNumber(product.cost_price)),
        status: product.status ? 'Active' : 'Inactive'
      })),
      stock_movements: movements.map((movement) => ({
        product_id: movement.product_id,
        product_name: movement.product ? movement.product.name : null,
        type: movement.type,
        quantity: toNumber(movement.quantity),
        reference_id: movement.reference_id,
        remarks: movement.remarks
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosSalesPaymentsReport = async (req, res) => {
  try {
    const sales = await fetchReportSales(req.query, req.user);
    const paymentMap = new Map();

    sales.forEach((sale) => {
      if (sale.payments && sale.payments.length > 0) {
        sale.payments.forEach((payment) => {
          const method = paymentKey(payment.method);
          const existing = paymentMap.get(method) || {
            method: paymentLabel(payment.method),
            sale_ids: new Set(),
            paid_amount: 0,
            total_amount: 0
          };

          existing.sale_ids.add(sale.id);
          existing.paid_amount = roundMoney(existing.paid_amount + toNumber(payment.amount));
          existing.total_amount = roundMoney(existing.total_amount + toNumber(payment.amount));

          paymentMap.set(method, existing);
        });
      } else {
        const cashPaid = paymentAmount(sale, 'cash');
        const creditAmt = creditAmountForSale(sale);

        if (cashPaid > 0) {
          const method = 'cash';
          const existing = paymentMap.get(method) || {
            method: paymentLabel('cash'),
            sale_ids: new Set(),
            paid_amount: 0,
            total_amount: 0
          };
          existing.sale_ids.add(sale.id);
          existing.paid_amount = roundMoney(existing.paid_amount + cashPaid);
          existing.total_amount = roundMoney(existing.total_amount + cashPaid);
          paymentMap.set(method, existing);
        }

        if (creditAmt > 0) {
          const method = 'credit';
          const existing = paymentMap.get(method) || {
            method: paymentLabel('credit'),
            sale_ids: new Set(),
            paid_amount: 0,
            total_amount: 0
          };
          existing.sale_ids.add(sale.id);
          existing.paid_amount = roundMoney(existing.paid_amount + creditAmt);
          existing.total_amount = roundMoney(existing.total_amount + creditAmt);
          paymentMap.set(method, existing);
        }
      }
    });

    res.json({
      payments: Array.from(paymentMap.values()).map((payment) => ({
        method: payment.method,
        bill_count: payment.sale_ids.size,
        paid_amount: payment.paid_amount,
        total_amount: payment.total_amount
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosSalesTaxDiscountsReport = async (req, res) => {
  try {
    const sales = await fetchReportSales(req.query, req.user);
    const taxAmount = roundMoney(sales.reduce((sum, sale) => sum + toNumber(sale.tax_total), 0));
    const discountAmount = roundMoney(sales.reduce((sum, sale) => sum + toNumber(sale.discount_total), 0));
    const taxableAmount = roundMoney(sales.reduce((sum, sale) => sum + toNumber(sale.subtotal) - toNumber(sale.discount_total), 0));
    const discountedBillCount = sales.filter((sale) => toNumber(sale.discount_total) > 0).length;

    res.json({
      tax: {
        tax_amount: taxAmount,
        taxable_amount: taxableAmount
      },
      discounts: {
        discount_amount: discountAmount,
        discounted_bill_count: discountedBillCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosSalesCreditReport = async (req, res) => {
  try {
    const sales = await fetchReportSales(req.query, req.user);
    const now = new Date();

    res.json({
      credit_sales: sales
        .map((sale) => {
          const creditAmount = creditAmountForSale(sale);

          return {
            sale_id: sale.id,
            sale_no: sale.sale_no,
            customer_id: sale.customer_id,
            customer_name: sale.customer ? sale.customer.name : 'Walk-in customer',
            cashier_id: sale.cashier_id,
            cashier_name: sale.cashier ? sale.cashier.name : null,
            total_amount: toNumber(sale.grand_total),
            paid_amount: nonCreditPaidAmountForSale(sale),
            credit_amount: creditAmount,
            due_days: Math.max(Math.floor((now - new Date(sale.sold_at)) / 86400000), 0),
            sold_at: sale.sold_at
          };
        })
        .filter((sale) => sale.credit_amount > 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
