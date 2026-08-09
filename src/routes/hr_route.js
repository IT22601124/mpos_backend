import express from 'express';
import * as hrController from '../controllers/hr_controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/hr/payroll', authMiddleware, hrController.getMonthlyPayroll);
router.post('/hr/payroll', authMiddleware, hrController.savePayrollRecord);
router.post('/hr/payroll/:id/pay', authMiddleware, hrController.paySalary);
router.get('/hr/advance-pay', authMiddleware, hrController.getAdvanceRequests);
router.post('/hr/advance-pay', authMiddleware, hrController.requestAdvancePay);
router.get('/hr/leaves', authMiddleware, hrController.getLeaveRequests);
router.post('/hr/leaves', authMiddleware, hrController.createLeaveRequest);

export default router;
