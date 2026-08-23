import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import zoneRoutes from './modules/admin/zones/zones.routes';
import areaRoutes from './modules/admin/areas/areas.routes';
import rateCardRoutes from './modules/admin/rate-cards/rate-cards.routes';
import codConfigRoutes from './modules/admin/cod-configs/cod-configs.routes';
import orderRoutes from './modules/orders/orders.routes';
import agentRoutes from './modules/agents/agents.routes';
import adminOrderRoutes from './modules/admin/orders/admin-orders.routes';
import dashboardRoutes from './modules/admin/dashboard/dashboard.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin/zones', zoneRoutes);
app.use('/api/v1/admin/areas', areaRoutes);
app.use('/api/v1/admin/rate-cards', rateCardRoutes);
app.use('/api/v1/admin/cod-configs', codConfigRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', agentRoutes);
app.use('/api/v1', adminOrderRoutes);
app.use('/api/v1', dashboardRoutes);

app.use(errorHandler);

export default app;
