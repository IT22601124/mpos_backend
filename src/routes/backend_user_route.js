const express = require('express');
const router = express.Router();
const backendUserController = require('../controllers/backend_user_controller');

router.post('/auth', backendUserController.createBackendUser);
router.post('/auth/login', backendUserController.loginBackendUser);

module.exports = router;