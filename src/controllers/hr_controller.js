import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { HRPayroll, HRAdvanceRequest, HRLeaveRequest, BackendUser } = require('../../models/index.js');

// Fetch or initialize monthly payroll sheet
export const getMonthlyPayroll = async (req, res) => {
  try {
    const { month } = req.query; // e.g. YYYY-MM
    if (!month) return res.status(400).json({ error: 'Month parameter is required' });

    let payrolls = await HRPayroll.findAll({
      where: { month },
      include: [{ model: BackendUser, as: 'user', attributes: ['name', 'role_id'] }]
    });

    // If records do not exist yet, generate them dynamically from current users list
    if (payrolls.length === 0) {
      const users = await BackendUser.findAll({ where: { status: 'active' } });
      const newPayrolls = users.map(user => ({
        userId: user.id,
        month,
        leaveCount: 0,
        workHours: 160,
        advancePay: 0,
        netSalary: user.salary || 35000,
        paymentStatus: 'Unpaid'
      }));

      await HRPayroll.bulkCreate(newPayrolls);
      
      payrolls = await HRPayroll.findAll({
        where: { month },
        include: [{ model: BackendUser, as: 'user', attributes: ['name', 'role_id'] }]
      });
    }

    const formatted = payrolls.map(p => ({
      id: p.id,
      userId: p.userId,
      userName: p.user ? p.user.name : 'Unknown User',
      userRole: p.user ? p.user.role_id : 'User',
      baseSalary: p.user ? p.user.salary || 35000 : 35000,
      month: p.month,
      leaveCount: p.leaveCount,
      workHours: p.workHours,
      advancePay: p.advancePay,
      netSalary: p.netSalary,
      paymentStatus: p.paymentStatus,
      paidAt: p.paidAt
    }));

    res.json({ success: true, payrolls: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update leaves/hours
export const savePayrollRecord = async (req, res) => {
  try {
    const { id, leaveCount, workHours, advancePay, netSalary } = req.body;
    const record = await HRPayroll.findByPk(id);
    if (!record) return res.status(404).json({ error: 'Record not found' });

    await record.update({ leaveCount, workHours, advancePay, netSalary });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm Salary payment
export const paySalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAt } = req.body;
    const record = await HRPayroll.findByPk(id);
    if (!record) return res.status(404).json({ error: 'Record not found' });

    await record.update({ paymentStatus: 'Paid', paidAt });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch advance requests
export const getAdvanceRequests = async (req, res) => {
  try {
    const requests = await HRAdvanceRequest.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: BackendUser, as: 'user', attributes: ['name'] }]
    });

    const formatted = requests.map(r => ({
      id: r.id,
      userId: r.userId,
      userName: r.user ? r.user.name : 'Unknown User',
      amount: r.amount,
      requestDate: r.requestDate,
      status: r.status,
      reason: r.reason
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request Advance Payment
export const requestAdvancePay = async (req, res) => {
  try {
    const { userId, amount, requestDate, reason } = req.body;
    const newRequest = await HRAdvanceRequest.create({
      userId,
      amount,
      requestDate,
      reason,
      status: 'Pending'
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Leave Requests
export const getLeaveRequests = async (req, res) => {
  try {
    const leaves = await HRLeaveRequest.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: BackendUser, as: 'user', attributes: ['name'] }]
    });

    const formatted = leaves.map(l => ({
      id: l.id,
      userId: l.userId,
      userName: l.user ? l.user.name : 'Unknown User',
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate: l.endDate,
      reason: l.reason,
      status: l.status
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Log New Leave Request & adjust monthly payroll leaf balance
export const createLeaveRequest = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    
    // Create leave
    const newLeave = await HRLeaveRequest.create({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'Approved' // Auto-approved
    });

    // Calculate days duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Adjust monthly payroll record for the user on that month!
    const month = startDate.substring(0, 7); // YYYY-MM
    const record = await HRPayroll.findOne({ where: { userId, month } });
    if (record) {
      const updatedLeaves = record.leaveCount + diffDays;
      const baseSalary = record.netSalary + (record.leaveCount * (record.netSalary / 30)); // back-calculate original base if needed or query user
      const dailyRate = baseSalary / 30;
      const leaveDeduction = updatedLeaves * dailyRate;
      const netSalary = Math.max(0, Math.round(baseSalary - leaveDeduction - record.advancePay));

      await record.update({
        leaveCount: updatedLeaves,
        netSalary
      });
    }

    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
