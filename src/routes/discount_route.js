import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as discountController from '../controllers/discount_controller.js';

const router = express.Router();

router.post('/discounts', authMiddleware, discountController.createDiscount);
router.get('/discounts', authMiddleware, discountController.getAllDiscounts);
router.get('/discounts/:id', authMiddleware, discountController.getDiscountById);
router.put('/discounts/:id', authMiddleware, discountController.updateDiscount);
router.delete('/discounts/:id', authMiddleware, discountController.deleteDiscount);

export default router;
