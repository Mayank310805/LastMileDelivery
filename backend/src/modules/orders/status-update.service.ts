import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';
import { validateTransition } from '../tracking/status-machine';
import { sendNotification } from '../notifications/notification.service';

export const agentUpdateStatus = async (orderId: string, agentUserId: string, newStatus: string, remarks?: string, failureReason?: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');

  const agent = await prisma.deliveryAgent.findUnique({ where: { userId: agentUserId } });
  if (order.currentAgentId !== agent?.id) throw new AppError(403, 'FORBIDDEN', 'Not assigned to this order');

  validateTransition(order.status, newStatus, false);

  if (newStatus === 'FAILED' && !failureReason) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Failure reason required for FAILED status');
  }

  const updateData: any = { status: newStatus };
  if (newStatus === 'DELIVERED') updateData.deliveredAt = new Date();

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: updateData }),
    prisma.trackingHistory.create({
      data: {
        orderId,
        previousStatus: order.status,
        newStatus,
        changedByUserId: agentUserId,
        actorRole: 'AGENT',
        remarks: failureReason ? `${failureReason}${remarks ? ` - ${remarks}` : ''}` : remarks
      }
    })
  ]);

  await sendNotification(order.customerId, orderId, newStatus, {});
};

export const adminOverrideStatus = async (orderId: string, adminUserId: string, newStatus: string, remark: string) => {
  if (!remark) throw new AppError(400, 'VALIDATION_ERROR', 'Remark required for override');
  
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');

  validateTransition(order.status, newStatus, true);

  const updateData: any = { status: newStatus };
  if (newStatus === 'DELIVERED') updateData.deliveredAt = new Date();

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: updateData }),
    prisma.trackingHistory.create({
      data: {
        orderId,
        previousStatus: order.status,
        newStatus,
        changedByUserId: adminUserId,
        actorRole: 'ADMIN',
        isOverride: true,
        remarks: remark
      }
    })
  ]);

  await sendNotification(order.customerId, orderId, newStatus, {});
};
