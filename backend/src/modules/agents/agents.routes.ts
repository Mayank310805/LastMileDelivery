import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import * as controller from './agents.controller';

const router = Router();
router.use(requireAuth);

router.patch('/agents/me/availability', requireRole('AGENT'), controller.updateAvailability);
router.patch('/agents/me/location', requireRole('AGENT'), controller.updateLocation);
router.get('/agents/me/orders', requireRole('AGENT'), controller.getMyOrders);
router.patch('/orders/:id/status', requireRole('AGENT'), controller.updateOrderStatus);

router.get('/admin/agents', requireRole('ADMIN'), controller.listAgents);
router.post('/admin/agents', requireRole('ADMIN'), controller.createAgent);
router.patch('/admin/agents/:id', requireRole('ADMIN'), controller.updateAgent);

export default router;
