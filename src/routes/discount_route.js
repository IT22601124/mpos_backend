const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const discountController = require('../controllers/discount_controller');

router.post('/discounts', authMiddleware, discountController.createDiscount);
router.get('/discounts', authMiddleware, discountController.getAllDiscounts);
router.get('/discounts/:id', authMiddleware, discountController.getDiscountById);
router.put('/discounts/:id', authMiddleware, discountController.updateDiscount);
router.delete('/discounts/:id', authMiddleware, discountController.deleteDiscount);

module.exports = router;
