const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const supplierController = require('../controllers/supplier_controller');

router.post('/suppliers', authMiddleware, supplierController.createSupplier);
router.get('/suppliers', authMiddleware, supplierController.getAllSuppliers);
router.get('/suppliers/:id', authMiddleware, supplierController.getSupplierById);
router.put('/suppliers/:id', authMiddleware, supplierController.updateSupplier);
router.delete('/suppliers/:id', authMiddleware, supplierController.deleteSupplier);

module.exports = router;
