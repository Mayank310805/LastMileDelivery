import { Request, Response, NextFunction } from 'express';
import * as service from './rate-cards.service';
import { createRateCardSchema } from './rate-cards.validators';

export const listRateCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.list();
    res.json({ data: result.data, meta: {} });
  } catch (error) { next(error); }
};

export const createRateCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createRateCardSchema.parse(req.body);
    const result = await service.create(parsed);
    res.status(201).json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const updateRateCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.update(req.params.id, req.body);
    res.json({ data: result, meta: {} });
  } catch (error) { next(error); }
};
