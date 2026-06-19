const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const productSupplierController = require('../controllers/product_supplier_controller');

router.post('/product-suppliers', authMiddleware, productSupplierController.createProductSupplier);
router.get('/product-suppliers', authMiddleware, productSupplierController.getAllProductSuppliers);
router.get('/product-suppliers/:id', authMiddleware, productSupplierController.getProductSupplierById);
router.put('/product-suppliers/:id', authMiddleware, productSupplierController.updateProductSupplier);
router.delete('/product-suppliers/:id', authMiddleware, productSupplierController.deleteProductSupplier);

module.exports = router;
