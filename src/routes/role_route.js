import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import superAdminMiddleware from '../middlewares/superAdminMiddleware.js';
import * as roleController from '../controllers/role_controller.js';

const router = express.Router();

router.post('/roles', authMiddleware, superAdminMiddleware, roleController.createRole);
router.get('/roles', authMiddleware, superAdminMiddleware, roleController.getAllRoles);
router.get('/roles/:id', authMiddleware, superAdminMiddleware, roleController.getRoleById);
router.put('/roles/:id', authMiddleware, superAdminMiddleware, roleController.updateRole);
router.delete('/roles/:id', authMiddleware, superAdminMiddleware, roleController.deleteRole);

export default router;
