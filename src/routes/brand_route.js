const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const brandController = require('../controllers/brand_controller');

router.post('/brands', authMiddleware, brandController.createBrand);
router.get('/brands', authMiddleware, brandController.getAllBrands);
router.get('/brands/:id', authMiddleware, brandController.getBrandById);
router.put('/brands/:id', authMiddleware, brandController.updateBrand);
router.delete('/brands/:id', authMiddleware, brandController.deleteBrand);

module.exports = router;
