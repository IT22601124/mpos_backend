const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const taxController = require('../controllers/tax_controller');

router.post('/taxes', authMiddleware, taxController.createTax);
router.get('/taxes', authMiddleware, taxController.getAllTaxes);
router.get('/taxes/:id', authMiddleware, taxController.getTaxById);
router.put('/taxes/:id', authMiddleware, taxController.updateTax);
router.delete('/taxes/:id', authMiddleware, taxController.deleteTax);

module.exports = router;
