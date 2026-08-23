import { Request, Response, NextFunction } from 'express';
import prisma from '../../../config/database';
import { adminOverrideStatus } from '../../orders/status-update.service';
import { manualAssignAgent, autoAssignAgent } from '../../assignment/auto-assignment.service';

export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const where: any = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.zoneId) where.pickupZoneId = req.query.zoneId;
    
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.order.count({ where })
    ]);
    res.json({ data, meta: { total, page, limit } });
  } catch (error) { next(error); }
};

export const overrideStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminOverrideStatus(req.params.id, req.user!.id, req.body.status, req.body.remark);
    res.json({ data: { success: true }, meta: {} });
  } catch (error) { next(error); }
};

export const manualAssign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await manualAssignAgent(req.params.id, req.body.agentId, req.user!.id);
    res.json({ data: { success: true }, meta: {} });
  } catch (error) { next(error); }
};

export const autoAssign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assigned = await autoAssignAgent(req.params.id, req.user!.id);
    res.json({ data: { success: true, assigned }, meta: {} });
  } catch (error) { next(error); }
};

export const autoAssignAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({ where: { status: 'CREATED' } });
    let count = 0;
    for (const order of orders) {
      if (await autoAssignAgent(order.id, req.user!.id)) count++;
    }
    res.json({ data: { success: true, assignedCount: count }, meta: {} });
  } catch (error) { next(error); }
};

export const listCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
    res.json({ data: customers, meta: {} });
  } catch (error) { next(error); }
};

export const listCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({ where: { customerId: req.params.id } });
    res.json({ data: orders, meta: {} });
  } catch (error) { next(error); }
};
