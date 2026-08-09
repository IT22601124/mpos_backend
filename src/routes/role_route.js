import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as roleController from '../controllers/role_controller.js';

const router = express.Router();

router.post('/roles', authMiddleware, roleController.createRole);
router.get('/roles', authMiddleware, roleController.getAllRoles);
router.get('/roles/:id', authMiddleware, roleController.getRoleById);
router.put('/roles/:id', authMiddleware, roleController.updateRole);
router.delete('/roles/:id', authMiddleware, roleController.deleteRole);

export default router;
