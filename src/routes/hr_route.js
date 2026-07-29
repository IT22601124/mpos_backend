const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hr_controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/hr/payroll', authMiddleware, hrController.getMonthlyPayroll);
router.post('/hr/payroll', authMiddleware, hrController.savePayrollRecord);
router.post('/hr/payroll/:id/pay', authMiddleware, hrController.paySalary);
router.get('/hr/advance-pay', authMiddleware, hrController.getAdvanceRequests);
router.post('/hr/advance-pay', authMiddleware, hrController.requestAdvancePay);
router.get('/hr/leaves', authMiddleware, hrController.getLeaveRequests);
router.post('/hr/leaves', authMiddleware, hrController.createLeaveRequest);

module.exports = router;
