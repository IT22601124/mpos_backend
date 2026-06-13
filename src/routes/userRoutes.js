import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createUserSchema } from '../validators/userValidator.js';

const router = Router();

router.get('/', userController.listUsers);
router.get('/:id', userController.getUser);
router.post('/', validateRequest(createUserSchema), userController.createUser);

export default router;
