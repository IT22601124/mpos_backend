const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const branchController = require('../controllers/branch_controller');

router.post('/branches', authMiddleware, branchController.createBranch);
router.get('/branches', authMiddleware, branchController.getAllBranches);
router.get('/branches/:id', authMiddleware, branchController.getBranchById);
router.put('/branches/:id', authMiddleware, branchController.updateBranch);
router.delete('/branches/:id', authMiddleware, branchController.deleteBranch);

module.exports = router;
