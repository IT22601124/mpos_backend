import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as productController from '../controllers/product_controller.js';

const router = express.Router();

router.post('/products', authMiddleware, productController.createProduct);
router.get('/products', authMiddleware, productController.getAllProducts);
router.get('/products/:id', authMiddleware, productController.getProductById);
router.put('/products/:id', authMiddleware, productController.updateProduct);
router.delete('/products/:id', authMiddleware, productController.deleteProduct);
router.post('/products/:productId/suppliers', authMiddleware, productController.addSupplierToProduct);

export default router;
