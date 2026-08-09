import express from 'express';
import * as roleController from '../controllers/role_controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/roles', authMiddleware, roleController.createRole);
router.get('/roles', authMiddleware, roleController.getAllRoles);
router.get('/roles/:id', authMiddleware, roleController.getRoleById);
router.put('/roles/:id', authMiddleware, roleController.updateRole);

export default router;