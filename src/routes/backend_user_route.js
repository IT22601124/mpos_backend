const express = require('express');
const router = express.Router();
const backendUserController = require('../controllers/backend_user_controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/auth/users', backendUserController.createBackendUser);
router.post('/auth/login', backendUserController.loginBackendUser);
router.get('/auth/users',authMiddleware, backendUserController.getAllBackendUsers);
router.put('/auth/users/:id', authMiddleware, backendUserController.updateBackendUser);
router.post('/auth/verify-token', authMiddleware, backendUserController.verifyToken);
router.post('/auth/logout', authMiddleware, backendUserController.logoutBackendUser);

module.exports = router;