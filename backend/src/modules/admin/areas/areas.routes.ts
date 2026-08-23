import { Router } from 'express';
import { requireAuth, requireRole } from '../../../middleware/auth';
import * as controller from './areas.controller';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));
router.get('/', controller.listAreas);
router.post('/', controller.createArea);
router.patch('/:id', controller.updateArea);
router.delete('/:id', controller.deleteArea);

export default router;
