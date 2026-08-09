import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as productSupplierController from '../controllers/product_supplier_controller.js';

const router = express.Router();

router.post('/product-suppliers', authMiddleware, productSupplierController.createProductSupplier);
router.get('/product-suppliers', authMiddleware, productSupplierController.getAllProductSuppliers);
router.get('/product-suppliers/:id', authMiddleware, productSupplierController.getProductSupplierById);
router.put('/product-suppliers/:id', authMiddleware, productSupplierController.updateProductSupplier);
router.delete('/product-suppliers/:id', authMiddleware, productSupplierController.deleteProductSupplier);

export default router;
