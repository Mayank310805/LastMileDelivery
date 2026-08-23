import { Request, Response, NextFunction } from 'express';
import * as service from './agents.service';
import { updateAvailabilitySchema, updateLocationSchema, createAgentSchema, updateStatusSchema } from './agents.validators';
import { agentUpdateStatus } from '../orders/status-update.service';

export const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateAvailabilitySchema.parse(req.body);
    await service.toggleAvailability(req.user!.id, parsed.isAvailable);
    res.json({ data: { success: true }, meta: {} });
  } catch (error) { next(error); }
};

export const updateLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateLocationSchema.parse(req.body);
    await service.updateLocation(req.user!.id, parsed);
    res.json({ data: { success: true }, meta: {} });
  } catch (error) { next(error); }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await service.getAssignedOrders(req.user!.id, req.query.status as string);
    res.json({ data: orders, meta: {} });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateStatusSchema.parse(req.body);
    await agentUpdateStatus(req.params.id, req.user!.id, parsed.status, parsed.remarks, parsed.failureReason);
    res.json({ data: { success: true }, meta: {} });
  } catch (error) { next(error); }
};

export const listAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agents = await service.listAgents();
    res.json({ data: agents, meta: {} });
  } catch (error) { next(error); }
};

export const createAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createAgentSchema.parse(req.body);
    const result = await service.createAgent(parsed);
    res.status(201).json({ data: result, meta: {} });
  } catch (error) { next(error); }
};

export const updateAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.updateAgent(req.params.id, req.body);
    res.json({ data: result, meta: {} });
  } catch (error) { next(error); }
};
