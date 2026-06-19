const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const productVariantController = require('../controllers/product_variant_controller');

router.post('/product-variants', authMiddleware, productVariantController.createProductVariant);
router.get('/product-variants', authMiddleware, productVariantController.getAllProductVariants);
router.get('/product-variants/:id', authMiddleware, productVariantController.getProductVariantById);
router.put('/product-variants/:id', authMiddleware, productVariantController.updateProductVariant);
router.delete('/product-variants/:id', authMiddleware, productVariantController.deleteProductVariant);

module.exports = router;
