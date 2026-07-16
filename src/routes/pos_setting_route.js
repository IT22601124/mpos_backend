const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const posSettingController = require('../controllers/pos_setting_controller');

router.get('/pos-settings', authMiddleware, posSettingController.getPosSettings);
router.put('/pos-settings', authMiddleware, posSettingController.updatePosSettings);

router.get('/pos-settings/payment-methods', authMiddleware, posSettingController.getPaymentMethods);
router.put('/pos-settings/payment-methods', authMiddleware, posSettingController.updatePaymentMethods);

router.get('/pos-settings/receipt', authMiddleware, posSettingController.getReceiptSettings);
router.put('/pos-settings/receipt', authMiddleware, posSettingController.updateReceiptSettings);

router.get('/pos-settings/discount-rules', authMiddleware, posSettingController.getDiscountRules);
router.put('/pos-settings/discount-rules', authMiddleware, posSettingController.updateDiscountRules);

module.exports = router;
