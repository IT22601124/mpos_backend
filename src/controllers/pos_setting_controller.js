const { PosSetting } = require('../../models');

const defaultSettings = () => ({
  payment_methods: [
    { key: 'cash', name: 'Cash', enabled: true },
    { key: 'card', name: 'Card', enabled: true },
    { key: 'credit', name: 'Credit', enabled: true },
    { key: 'bank_transfer', name: 'Bank Transfer', enabled: false },
    { key: 'mobile', name: 'Mobile', enabled: false },
    { key: 'voucher', name: 'Voucher', enabled: false }
  ],
  receipt: {
    show_logo: true,
    show_tax_number: true,
    show_cashier: true,
    show_customer: true,
    footer_text: 'Thank you for shopping with us'
  },
  discount_rules: {
    allow_manual_discount: true,
    max_discount_percent: 100,
    require_manager_approval: false
  }
});

const parseJsonValue = (value, fallback) => {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

const serializeSettings = (settings) => {
  const defaults = defaultSettings();

  if (!settings) {
    return defaults;
  }

  const data = settings.toJSON ? settings.toJSON() : settings;

  return {
    id: data.id,
    payment_methods: parseJsonValue(data.payment_methods, defaults.payment_methods),
    receipt: parseJsonValue(data.receipt, defaults.receipt),
    discount_rules: parseJsonValue(data.discount_rules, defaults.discount_rules),
    created_by: data.created_by || null,
    updated_by: data.updated_by || null,
    created_at: data.created_at || null,
    updated_at: data.updated_at || null
  };
};

const getCurrentSettings = () => PosSetting.findOne({
  order: [['id', 'ASC']]
});

const buildPayload = (body, allowedFields) => {
  const payload = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = parseJsonValue(body[field], defaultSettings()[field]);
    }
  });

  return payload;
};

const saveSettings = async (req, allowedFields) => {
  const existing = await getCurrentSettings();
  const payload = buildPayload(req.body, allowedFields);
  const userId = req.user ? req.user.id : null;

  if (existing) {
    await existing.update({
      ...payload,
      updated_by: userId
    });
    return getCurrentSettings();
  }

  return PosSetting.create({
    ...defaultSettings(),
    ...payload,
    created_by: userId,
    updated_by: userId
  });
};

const sendSettings = (res, settings) => {
  const serialized = serializeSettings(settings);

  res.json({
    success: true,
    pos_settings: serialized,
    payment_methods: serialized.payment_methods,
    receipt: serialized.receipt,
    discount_rules: serialized.discount_rules
  });
};

exports.getPosSettings = async (_req, res) => {
  try {
    const settings = await getCurrentSettings();
    sendSettings(res, settings);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePosSettings = async (req, res) => {
  try {
    const settings = await saveSettings(req, ['payment_methods', 'receipt', 'discount_rules']);
    sendSettings(res, settings);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPaymentMethods = async (_req, res) => {
  try {
    const settings = serializeSettings(await getCurrentSettings());
    res.json({ success: true, payment_methods: settings.payment_methods, data: settings.payment_methods });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePaymentMethods = async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? { payment_methods: req.body } : req.body;
    const settings = await saveSettings({ ...req, body }, ['payment_methods']);
    const serialized = serializeSettings(settings);
    res.json({ success: true, payment_methods: serialized.payment_methods, data: serialized.payment_methods });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getReceiptSettings = async (_req, res) => {
  try {
    const settings = serializeSettings(await getCurrentSettings());
    res.json({ success: true, receipt: settings.receipt, data: settings.receipt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateReceiptSettings = async (req, res) => {
  try {
    const body = req.body.receipt ? req.body : { receipt: req.body };
    const settings = await saveSettings({ ...req, body }, ['receipt']);
    const serialized = serializeSettings(settings);
    res.json({ success: true, receipt: serialized.receipt, data: serialized.receipt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDiscountRules = async (_req, res) => {
  try {
    const settings = serializeSettings(await getCurrentSettings());
    res.json({ success: true, discount_rules: settings.discount_rules, data: settings.discount_rules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateDiscountRules = async (req, res) => {
  try {
    const body = req.body.discount_rules ? req.body : { discount_rules: req.body };
    const settings = await saveSettings({ ...req, body }, ['discount_rules']);
    const serialized = serializeSettings(settings);
    res.json({ success: true, discount_rules: serialized.discount_rules, data: serialized.discount_rules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
