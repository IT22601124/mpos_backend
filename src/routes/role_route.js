const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleController = require('../controllers/role_controller');

router.post('/roles', authMiddleware, roleController.createRole);
router.get('/roles', authMiddleware, roleController.getAllRoles);
router.get('/roles/:id', authMiddleware, roleController.getRoleById);
router.put('/roles/:id', authMiddleware, roleController.updateRole);
router.delete('/roles/:id', authMiddleware, roleController.deleteRole);

module.exports = router;
