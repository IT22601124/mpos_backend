const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const productImageController = require('../controllers/product_image_controller');

router.post('/product-images', authMiddleware, productImageController.createProductImage);
router.get('/product-images', authMiddleware, productImageController.getAllProductImages);
router.get('/product-images/:id', authMiddleware, productImageController.getProductImageById);
router.put('/product-images/:id', authMiddleware, productImageController.updateProductImage);
router.delete('/product-images/:id', authMiddleware, productImageController.deleteProductImage);

module.exports = router;
