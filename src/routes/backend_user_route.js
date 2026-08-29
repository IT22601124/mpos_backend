import express from 'express';
import * as backendUserController from '../controllers/backend_user_controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import superAdminMiddleware from '../middlewares/superAdminMiddleware.js';

const router = express.Router();

router.post('/auth/users', authMiddleware, superAdminMiddleware, backendUserController.createBackendUser);
router.post('/auth/login', backendUserController.loginBackendUser);
router.get('/auth/users', authMiddleware, superAdminMiddleware, backendUserController.getAllBackendUsers);
router.put('/auth/users/:id', authMiddleware, superAdminMiddleware, backendUserController.updateBackendUser);
router.post('/auth/verify-token', authMiddleware, backendUserController.verifyToken);
router.post('/auth/logout', authMiddleware, backendUserController.logoutBackendUser);

export default router;