import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as productVariantController from '../controllers/product_variant_controller.js';

const router = express.Router();

router.post('/product-variants', authMiddleware, productVariantController.createProductVariant);
router.get('/product-variants', authMiddleware, productVariantController.getAllProductVariants);
router.get('/product-variants/:id', authMiddleware, productVariantController.getProductVariantById);
router.put('/product-variants/:id', authMiddleware, productVariantController.updateProductVariant);
router.delete('/product-variants/:id', authMiddleware, productVariantController.deleteProductVariant);

export default router;
