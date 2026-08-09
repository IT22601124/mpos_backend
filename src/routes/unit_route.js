import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as unitController from '../controllers/unit_controller.js';

const router = express.Router();

router.post('/units', authMiddleware, unitController.createUnit);
router.get('/units', authMiddleware, unitController.getAllUnits);
router.get('/units/:id', authMiddleware, unitController.getUnitById);
router.put('/units/:id', authMiddleware, unitController.updateUnit);
router.delete('/units/:id', authMiddleware, unitController.deleteUnit);

export default router;
