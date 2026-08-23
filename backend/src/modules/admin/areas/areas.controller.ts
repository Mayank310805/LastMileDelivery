import { Request, Response, NextFunction } from 'express';
import * as service from './areas.service';
import { createAreaSchema, updateAreaSchema } from './areas.validators';

export const listAreas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.list(req.query.zoneId as string, Number(req.query.page) || 1, Number(req.query.limit) || 10);
    res.json({ data: result.data, meta: { total: result.total, page: result.page, limit: result.limit } });
  } catch (error) { next(error); }
};

export const createArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createAreaSchema.parse(req.body);
    const result = await service.create(parsed);
    res.status(201).json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const updateArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateAreaSchema.parse(req.body);
    const result = await service.update(req.params.id, parsed);
    res.json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const deleteArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (error) { next(error); }
};
