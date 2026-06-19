const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customer_controller');

router.post('/customers', authMiddleware, customerController.createCustomer);
router.get('/customers', authMiddleware, customerController.getAllCustomers);
router.get('/customers/:id', authMiddleware, customerController.getCustomerById);
router.put('/customers/:id', authMiddleware, customerController.updateCustomer);
router.delete('/customers/:id', authMiddleware, customerController.deleteCustomer);

module.exports = router;
