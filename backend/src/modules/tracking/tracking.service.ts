import prisma from '../../config/database';

export const createTrackingEntry = async (data: any) => {
  return prisma.trackingHistory.create({ data });
};

export const getTrackingHistory = async (orderId: string) => {
  return prisma.trackingHistory.findMany({ where: { orderId }, orderBy: { createdAt: 'asc' } });
};
