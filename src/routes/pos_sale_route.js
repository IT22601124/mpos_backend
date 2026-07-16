const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const posSaleController = require('../controllers/pos_sale_controller');

router.post('/pos-sales', authMiddleware, posSaleController.createPosSale);
router.get('/pos-sales', authMiddleware, posSaleController.getAllPosSales);
router.get('/dashboard', authMiddleware, posSaleController.getDashboardReport);
router.get('/pos-sales/reports/summary', authMiddleware, posSaleController.getPosSalesSummaryReport);
router.get('/pos-sales/reports/sales', authMiddleware, posSaleController.getPosSalesReport);
router.get('/pos-sales/reports/cashiers', authMiddleware, posSaleController.getPosSalesCashiersReport);
router.get('/pos-sales/reports/products', authMiddleware, posSaleController.getPosSalesProductsReport);
router.get('/pos-sales/reports/items', authMiddleware, posSaleController.getPosSalesItemsReport);
router.get('/pos-sales/reports/inventory', authMiddleware, posSaleController.getPosSalesInventoryReport);
router.get('/pos-sales/reports/payments', authMiddleware, posSaleController.getPosSalesPaymentsReport);
router.get('/pos-sales/reports/tax-discounts', authMiddleware, posSaleController.getPosSalesTaxDiscountsReport);
router.get('/pos-sales/reports/credit', authMiddleware, posSaleController.getPosSalesCreditReport);
router.get('/pos-sales/:id', authMiddleware, posSaleController.getPosSaleById);
router.put('/pos-sales/:id/status', authMiddleware, posSaleController.updatePosSaleStatus);
router.delete('/pos-sales/:id', authMiddleware, posSaleController.deletePosSale);

module.exports = router;
