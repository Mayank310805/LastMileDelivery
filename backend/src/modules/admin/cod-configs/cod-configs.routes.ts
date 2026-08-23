import { Router } from 'express';
import { requireAuth, requireRole } from '../../../middleware/auth';
import * as controller from './cod-configs.controller';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));
router.get('/', controller.listCodConfigs);
router.post('/', controller.createCodConfig);
router.patch('/:id', controller.updateCodConfig);

export default router;
