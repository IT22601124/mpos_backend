import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as posSettingController from '../controllers/pos_setting_controller.js';

const router = express.Router();

router.get('/pos-settings', authMiddleware, posSettingController.getPosSettings);
router.put('/pos-settings', authMiddleware, posSettingController.updatePosSettings);

router.get('/pos', authMiddleware, posSettingController.getPosSettings);
router.put('/pos', authMiddleware, posSettingController.updatePosSettings);

router.get('/pos-settings/payment-methods', authMiddleware, posSettingController.getPaymentMethods);
router.put('/pos-settings/payment-methods', authMiddleware, posSettingController.updatePaymentMethods);

router.get('/pos-settings/receipt', authMiddleware, posSettingController.getReceiptSettings);
router.put('/pos-settings/receipt', authMiddleware, posSettingController.updateReceiptSettings);

router.get('/pos-settings/discount-rules', authMiddleware, posSettingController.getDiscountRules);
router.put('/pos-settings/discount-rules', authMiddleware, posSettingController.updateDiscountRules);

export default router;
