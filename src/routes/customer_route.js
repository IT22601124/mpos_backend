import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as customerController from '../controllers/customer_controller.js';

const router = express.Router();

router.post('/customers', authMiddleware, customerController.createCustomer);
router.get('/customers', authMiddleware, customerController.getAllCustomers);
router.get('/customers/:id', authMiddleware, customerController.getCustomerById);
router.put('/customers/:id', authMiddleware, customerController.updateCustomer);
router.delete('/customers/:id', authMiddleware, customerController.deleteCustomer);

export default router;
