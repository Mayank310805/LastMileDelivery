import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import * as controller from './orders.controller';

const router = Router();
router.use(requireAuth);

router.post('/orders/quote', controller.quoteOrder);
router.post('/orders', controller.createOrder);
router.get('/orders', controller.listOrders);
router.get('/orders/:id', controller.getOrder);
router.get('/orders/:id/tracking', controller.getTracking);
router.post('/orders/:id/reschedule', requireRole('CUSTOMER'), controller.rescheduleOrder);

export default router;
