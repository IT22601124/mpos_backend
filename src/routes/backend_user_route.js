const express = require('express');
const router = express.Router();
const backendUserController = require('../controllers/backend_user_controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/auth/users', backendUserController.createBackendUser);
router.post('/auth/login', backendUserController.loginBackendUser);
router.get('/auth/users',authMiddleware, backendUserController.getAllBackendUsers);
router.post('/auth/verify-token', authMiddleware, backendUserController.verifyToken);

module.exports = router;