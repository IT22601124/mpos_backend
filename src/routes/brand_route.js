import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as brandController from '../controllers/brand_controller.js';

const router = express.Router();

router.post('/brands', authMiddleware, brandController.createBrand);
router.get('/brands', authMiddleware, brandController.getAllBrands);
router.get('/brands/:id', authMiddleware, brandController.getBrandById);
router.put('/brands/:id', authMiddleware, brandController.updateBrand);
router.delete('/brands/:id', authMiddleware, brandController.deleteBrand);

export default router;
