import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as supplierController from '../controllers/supplier_controller.js';

const router = express.Router();

router.post('/suppliers', authMiddleware, supplierController.createSupplier);
router.get('/suppliers', authMiddleware, supplierController.getAllSuppliers);
router.get('/suppliers/:id', authMiddleware, supplierController.getSupplierById);
router.put('/suppliers/:id', authMiddleware, supplierController.updateSupplier);
router.delete('/suppliers/:id', authMiddleware, supplierController.deleteSupplier);

export default router;
