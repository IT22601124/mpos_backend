import express from 'express';
import * as backendUserController from '../controllers/backend_user_controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/auth/users', backendUserController.createBackendUser);
router.post('/auth/login', backendUserController.loginBackendUser);
router.get('/auth/users', authMiddleware, backendUserController.getAllBackendUsers);
router.put('/auth/users/:id', authMiddleware, backendUserController.updateBackendUser);
router.post('/auth/verify-token', authMiddleware, backendUserController.verifyToken);
router.post('/auth/logout', authMiddleware, backendUserController.logoutBackendUser);

export default router;