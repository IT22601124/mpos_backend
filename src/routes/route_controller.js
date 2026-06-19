const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role_controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/roles', authMiddleware, roleController.createRole);
router.get('/roles', authMiddleware, roleController.getAllRoles);
router.get('/roles/:id', authMiddleware, roleController.getRoleById);
router.put('/roles/:id', authMiddleware, roleController.updateRole);