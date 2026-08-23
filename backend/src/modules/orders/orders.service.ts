import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';
import { calculateRate } from './rate-calc-engine';
import { autoAssignAgent } from '../assignment/auto-assignment.service';
import { sendNotification } from '../notifications/notification.service';

const generateOrderNumber = async () => {
  const count = await prisma.order.count();
  const year = new Date().getFullYear();
  return `LMD-${year}-${String(count + 1).padStart(6, '0')}`;
};

export const quote = async (input: any) => {
  return await calculateRate(input);
};

export const createOrder = async (input: any, userId: string, userRole: string) => {
  const customerId = userRole === 'ADMIN' ? input.customerId : userId;
  if (!customerId) throw new AppError(400, 'CUSTOMER_REQUIRED', 'Customer ID is required');

  const rate = await calculateRate(input);
  const orderNumber = await generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customer: { connect: { id: customerId } },
      pickupAddress: { create: { ...input.pickupAddress, createdByUser: { connect: { id: userId } } } },
      dropAddress: { create: { ...input.dropAddress, createdByUser: { connect: { id: userId } } } },
      lengthCm: input.lengthCm,
      breadthCm: input.breadthCm,
      heightCm: input.heightCm,
      actualWeightKg: input.actualWeightKg,
      orderType: input.orderType,
      paymentType: input.paymentType,
      volumetricWeightKg: rate.volumetricWeightKg,
      billableWeightKg: rate.billableWeightKg,
      baseCharge: rate.baseCharge,
      codSurcharge: rate.codSurcharge,
      totalCharge: rate.totalCharge,
      status: 'CREATED',
      pickupZone: { connect: { id: rate.pickupZoneId } },
      dropZone: { connect: { id: rate.dropZoneId } },
      zoneRelation: rate.zoneRelation,
      createdByUser: { connect: { id: userId } }
    }
  });

  await prisma.trackingHistory.create({
    data: { orderId: order.id, newStatus: 'CREATED', changedByUserId: userId, actorRole: userRole, remarks: 'Order created' }
  });

  // Attempt auto-assignment asynchronously (fire and forget for now, or await)
  await autoAssignAgent(order.id, userId).catch(console.error);

  // Send order-created notification email to customer
  await sendNotification(customerId, order.id, 'CREATED', { orderNumber: order.orderNumber }).catch(console.error);

  return order;
};

export const getOrderById = async (orderId: string, userId: string, userRole: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { pickupAddress: true, dropAddress: true, currentAgent: { include: { user: true } } }
  });
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
  if (userRole === 'CUSTOMER' && order.customerId !== userId) throw new AppError(403, 'FORBIDDEN', 'Access denied');
  return order;
};

export const listOrders = async (userId: string, userRole: string, filters: any, page = 1, limit = 10) => {
  const where: any = {};
  if (userRole === 'CUSTOMER') where.customerId = userId;
  
  const [data, total] = await Promise.all([
    prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.order.count({ where })
  ]);
  return { data, total, page, limit };
};

export const getTracking = async (orderId: string, userId: string, userRole: string) => {
  await getOrderById(orderId, userId, userRole);
  return prisma.trackingHistory.findMany({ where: { orderId }, orderBy: { createdAt: 'asc' } });
};

export const reschedule = async (orderId: string, userId: string, newDate: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
  if (order.customerId !== userId) throw new AppError(403, 'FORBIDDEN', 'Access denied');
  if (order.status !== 'FAILED') throw new AppError(400, 'INVALID_STATUS', 'Only failed orders can be rescheduled');
  
  const rescheduleCount = await prisma.reschedule.count({ where: { orderId } });
  if (rescheduleCount >= 3) throw new AppError(409, 'MAX_RESCHEDULES_EXCEEDED', 'Max 3 reschedules allowed');

  await prisma.$transaction([
    prisma.reschedule.create({
      data: {
        orderId,
        requestedByUserId: userId,
        previousScheduledDate: order.scheduledDeliveryDate,
        newScheduledDate: new Date(newDate),
        notes: 'Customer requested'
      }
    }),
    prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'RESCHEDULED',
        currentAgentId: null,
        scheduledDeliveryDate: new Date(newDate),
        rescheduleCount: { increment: 1 }
      }
    }),
    prisma.trackingHistory.create({
      data: {
        orderId,
        previousStatus: order.status,
        newStatus: 'RESCHEDULED',
        changedByUserId: userId,
        actorRole: 'CUSTOMER',
        remarks: 'Customer requested reschedule'
      }
    })
  ]);

  await autoAssignAgent(order.id, userId).catch(console.error);
};
