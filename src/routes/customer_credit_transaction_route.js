import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as customerCreditTransactionController from '../controllers/customer_credit_transaction_controller.js';

const router = express.Router();

router.post('/customer-credit-transactions', authMiddleware, customerCreditTransactionController.createCustomerCreditTransaction);
router.get('/customer-credit-transactions', authMiddleware, customerCreditTransactionController.getAllCustomerCreditTransactions);
router.get('/customer-credit-transactions/:id', authMiddleware, customerCreditTransactionController.getCustomerCreditTransactionById);
router.put('/customer-credit-transactions/:id', authMiddleware, customerCreditTransactionController.updateCustomerCreditTransaction);
router.delete('/customer-credit-transactions/:id', authMiddleware, customerCreditTransactionController.deleteCustomerCreditTransaction);

export default router;
