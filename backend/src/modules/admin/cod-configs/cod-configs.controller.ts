import { Request, Response, NextFunction } from 'express';
import * as service from './cod-configs.service';
import { createCodConfigSchema } from './cod-configs.validators';

export const listCodConfigs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.list();
    res.json({ data: result.data, meta: {} });
  } catch (error) { next(error); }
};

export const createCodConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createCodConfigSchema.parse(req.body);
    const result = await service.create(parsed);
    res.status(201).json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const updateCodConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.update(req.params.id, req.body);
    res.json({ data: result, meta: {} });
  } catch (error) { next(error); }
};
