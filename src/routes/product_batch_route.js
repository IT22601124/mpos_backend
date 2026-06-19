const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const productBatchController = require('../controllers/product_batch_controller');

router.post('/product-batches', authMiddleware, productBatchController.createProductBatch);
router.get('/product-batches', authMiddleware, productBatchController.getAllProductBatches);
router.get('/product-batches/:id', authMiddleware, productBatchController.getProductBatchById);
router.put('/product-batches/:id', authMiddleware, productBatchController.updateProductBatch);
router.delete('/product-batches/:id', authMiddleware, productBatchController.deleteProductBatch);

module.exports = router;
