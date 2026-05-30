import { Router } from 'express';
import { getProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, getProfile);

export default router;
