import prisma from '../../../config/database';

export const getKpiSummary = async () => {
  const [
    totalOrders,
    unassignedCount,
    failedCount,
    activeAgents
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'CREATED', currentAgentId: null } }),
    prisma.order.count({ where: { status: 'FAILED' } }),
    prisma.deliveryAgent.count({ where: { isAvailable: true } })
  ]);

  const statusGroup = await prisma.order.groupBy({
    by: ['status'],
    _count: { id: true }
  });
  const ordersByStatus = statusGroup.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count.id }), {});

  const zoneGroup = await prisma.order.groupBy({
    by: ['pickupZoneId'],
    _count: { id: true }
  });
  const ordersByZone = zoneGroup.reduce((acc, curr) => ({ ...acc, [curr.pickupZoneId]: curr._count.id }), {});

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayDeliveries = await prisma.order.count({
    where: { status: 'DELIVERED', deliveredAt: { gte: startOfDay } }
  });

  return { ordersByStatus, totalOrders, unassignedCount, failedCount, todayDeliveries, activeAgents, ordersByZone };
};

export const getNotifications = async (page = 1, limit = 10) => {
  const [data, total] = await Promise.all([
    prisma.notification.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.notification.count()
  ]);
  return { data, total, page, limit };
};
