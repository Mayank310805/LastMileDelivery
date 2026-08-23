import { Router } from 'express';
import { requireAuth, requireRole } from '../../../middleware/auth';
import * as controller from './dashboard.controller';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/admin/dashboard', controller.getDashboardSummary);
router.get('/admin/notifications', controller.getNotificationsList);

export default router;
