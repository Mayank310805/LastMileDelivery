import { Router } from 'express';
import { requireAuth, requireRole } from '../../../middleware/auth';
import * as controller from './zones.controller';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));
router.get('/', controller.listZones);
router.post('/', controller.createZone);
router.patch('/:id', controller.updateZone);
router.delete('/:id', controller.deleteZone);

export default router;
