const express = require('express');
const router = express.Router();
const backendUserController = require('../controllers/backend_user_controller');

router.post('/backend-users', backendUserController.createBackendUser);

module.exports = router;