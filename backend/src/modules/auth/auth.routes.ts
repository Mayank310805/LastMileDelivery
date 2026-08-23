import { Router } from 'express';
import * as authController from './auth.controller';
import { authRateLimiter } from '../../middleware/rateLimit';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getProfile);

export default router;
