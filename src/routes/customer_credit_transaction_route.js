const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customerCreditTransactionController = require('../controllers/customer_credit_transaction_controller');

router.post('/customer-credit-transactions', authMiddleware, customerCreditTransactionController.createCustomerCreditTransaction);
router.get('/customer-credit-transactions', authMiddleware, customerCreditTransactionController.getAllCustomerCreditTransactions);
router.get('/customer-credit-transactions/:id', authMiddleware, customerCreditTransactionController.getCustomerCreditTransactionById);
router.put('/customer-credit-transactions/:id', authMiddleware, customerCreditTransactionController.updateCustomerCreditTransaction);
router.delete('/customer-credit-transactions/:id', authMiddleware, customerCreditTransactionController.deleteCustomerCreditTransaction);

module.exports = router;
