import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as taxController from '../controllers/tax_controller.js';

const router = express.Router();

router.post('/taxes', authMiddleware, taxController.createTax);
router.get('/taxes', authMiddleware, taxController.getAllTaxes);
router.get('/taxes/:id', authMiddleware, taxController.getTaxById);
router.put('/taxes/:id', authMiddleware, taxController.updateTax);
router.delete('/taxes/:id', authMiddleware, taxController.deleteTax);

export default router;
