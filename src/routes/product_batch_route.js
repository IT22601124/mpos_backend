import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as productBatchController from '../controllers/product_batch_controller.js';

const router = express.Router();

router.post('/product-batches', authMiddleware, productBatchController.createProductBatch);
router.get('/product-batches', authMiddleware, productBatchController.getAllProductBatches);
router.get('/product-batches/:id', authMiddleware, productBatchController.getProductBatchById);
router.put('/product-batches/:id', authMiddleware, productBatchController.updateProductBatch);
router.delete('/product-batches/:id', authMiddleware, productBatchController.deleteProductBatch);

export default router;
