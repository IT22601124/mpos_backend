const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const stockMovementController = require('../controllers/stock_movement_controller');

router.post('/stock-movements', authMiddleware, stockMovementController.createStockMovement);
router.get('/stock-movements', authMiddleware, stockMovementController.getAllStockMovements);
router.get('/stock-movements/:id', authMiddleware, stockMovementController.getStockMovementById);
router.put('/stock-movements/:id', authMiddleware, stockMovementController.updateStockMovement);
router.delete('/stock-movements/:id', authMiddleware, stockMovementController.deleteStockMovement);

module.exports = router;
