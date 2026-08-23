import { Request, Response, NextFunction } from 'express';
import * as service from './dashboard.service';

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getKpiSummary();
    res.json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const getNotificationsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getNotifications(Number(req.query.page) || 1, Number(req.query.limit) || 10);
    res.json({ data: result.data, meta: { total: result.total, page: result.page, limit: result.limit } });
  } catch (error) { next(error); }
};
