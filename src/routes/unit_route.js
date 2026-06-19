const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const unitController = require('../controllers/unit_controller');

router.post('/units', authMiddleware, unitController.createUnit);
router.get('/units', authMiddleware, unitController.getAllUnits);
router.get('/units/:id', authMiddleware, unitController.getUnitById);
router.put('/units/:id', authMiddleware, unitController.updateUnit);
router.delete('/units/:id', authMiddleware, unitController.deleteUnit);

module.exports = router;
