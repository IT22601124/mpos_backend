import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as categoryController from '../controllers/category_controller.js';

const router = express.Router();

router.post('/categories', authMiddleware, categoryController.createCategory);
router.get('/categories', authMiddleware, categoryController.getAllCategories);
router.get('/categories/:id', authMiddleware, categoryController.getCategoryById);
router.put('/categories/:id', authMiddleware, categoryController.updateCategory);
router.delete('/categories/:id', authMiddleware, categoryController.deleteCategory);

export default router;
