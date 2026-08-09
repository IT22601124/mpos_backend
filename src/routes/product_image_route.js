import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as productImageController from '../controllers/product_image_controller.js';

const router = express.Router();

router.post('/product-images', authMiddleware, productImageController.createProductImage);
router.get('/product-images', authMiddleware, productImageController.getAllProductImages);
router.get('/product-images/:id', authMiddleware, productImageController.getProductImageById);
router.put('/product-images/:id', authMiddleware, productImageController.updateProductImage);
router.delete('/product-images/:id', authMiddleware, productImageController.deleteProductImage);

export default router;
