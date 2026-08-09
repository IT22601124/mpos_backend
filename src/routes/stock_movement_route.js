import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as stockMovementController from '../controllers/stock_movement_controller.js';

const router = express.Router();

router.post('/stock-movements', authMiddleware, stockMovementController.createStockMovement);
router.get('/stock-movements', authMiddleware, stockMovementController.getAllStockMovements);
router.get('/stock-movements/:id', authMiddleware, stockMovementController.getStockMovementById);
router.put('/stock-movements/:id', authMiddleware, stockMovementController.updateStockMovement);
router.delete('/stock-movements/:id', authMiddleware, stockMovementController.deleteStockMovement);

export default router;
