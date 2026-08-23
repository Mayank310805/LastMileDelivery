import { Router } from 'express';
import { requireAuth, requireRole } from '../../../middleware/auth';
import * as controller from './rate-cards.controller';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));
router.get('/', controller.listRateCards);
router.post('/', controller.createRateCard);
router.patch('/:id', controller.updateRateCard);

export default router;
