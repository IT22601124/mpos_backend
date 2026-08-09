import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as branchController from '../controllers/branch_controller.js';

const router = express.Router();

router.post('/branches', authMiddleware, branchController.createBranch);
router.get('/branches', authMiddleware, branchController.getAllBranches);
router.get('/branches/:id', authMiddleware, branchController.getBranchById);
router.put('/branches/:id', authMiddleware, branchController.updateBranch);
router.delete('/branches/:id', authMiddleware, branchController.deleteBranch);

export default router;
