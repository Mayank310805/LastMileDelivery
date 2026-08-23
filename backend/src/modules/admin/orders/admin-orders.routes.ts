import { Router } from 'express';
import { requireAuth, requireRole } from '../../../middleware/auth';
import * as controller from './admin-orders.controller';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/admin/orders', controller.listOrders);
router.patch('/admin/orders/:id/status', controller.overrideStatus);
router.post('/admin/orders/:id/assign', controller.manualAssign);
router.post('/admin/orders/:id/auto-assign', controller.autoAssign);
router.post('/admin/orders/auto-assign-all', controller.autoAssignAll);

router.get('/admin/customers', controller.listCustomers);
router.get('/admin/customers/:id/orders', controller.listCustomerOrders);

export default router;
