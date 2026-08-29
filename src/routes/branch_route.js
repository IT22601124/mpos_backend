import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import superAdminMiddleware from '../middlewares/superAdminMiddleware.js';
import * as branchController from '../controllers/branch_controller.js';

const router = express.Router();

router.post('/branches', authMiddleware, superAdminMiddleware, branchController.createBranch);
router.get('/branches', authMiddleware, superAdminMiddleware, branchController.getAllBranches);
router.get('/branches/:id', authMiddleware, superAdminMiddleware, branchController.getBranchById);
router.put('/branches/:id', authMiddleware, superAdminMiddleware, branchController.updateBranch);
router.delete('/branches/:id', authMiddleware, superAdminMiddleware, branchController.deleteBranch);

export default router;
