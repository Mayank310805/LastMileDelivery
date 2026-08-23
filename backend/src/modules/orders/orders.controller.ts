import { Request, Response, NextFunction } from 'express';
import * as service from './orders.service';
import { quoteSchema, createOrderSchema, rescheduleSchema } from './orders.validators';

export const quoteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = quoteSchema.parse(req.body);
    const result = await service.quote(parsed);
    res.json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createOrderSchema.parse(req.body);
    const result = await service.createOrder(parsed, req.user!.id, req.user!.role);
    res.status(201).json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.listOrders(req.user!.id, req.user!.role, req.query, Number(req.query.page) || 1, Number(req.query.limit) || 10);
    res.json({ data: result.data, meta: { total: result.total, page: result.page, limit: result.limit } });
  } catch (error) { next(error); }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getOrderById(req.params.id, req.user!.id, req.user!.role);
    res.json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const getTracking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getTracking(req.params.id, req.user!.id, req.user!.role);
    res.json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const rescheduleOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = rescheduleSchema.parse(req.body);
    await service.reschedule(req.params.id, req.user!.id, parsed.newScheduledDate);
    res.json({ data: { success: true }, meta: {} });
  } catch (error) { next(error); }
};
