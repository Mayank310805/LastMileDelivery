import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function getActiveOrderCount(agentId: string) {
  return prisma.order.count({
    where: { currentAgentId: agentId, status: { in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] } }
  });
}

export async function autoAssignAgent(orderId: string, assignedByUserId: string): Promise<boolean> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== 'CREATED' && order.status !== 'RESCHEDULED') return false;

  const allAgents = await prisma.deliveryAgent.findMany({ where: { isAvailable: true } });
  const activeCounts = await Promise.all(allAgents.map(a => getActiveOrderCount(a.id)));
  const candidates = allAgents.filter((a, i) => activeCounts[i] < a.maxConcurrentOrders);

  if (candidates.length === 0) return false;

  // For simplicity in this demo, just pick the one with lowest active orders in the same zone
  const zoneCandidates = candidates.filter(a => a.currentZoneId === order.pickupZoneId);
  const pool = zoneCandidates.length > 0 ? zoneCandidates : candidates;

  const selected = pool.sort((a, b) => {
    const idxA = allAgents.findIndex(ag => ag.id === a.id);
    const idxB = allAgents.findIndex(ag => ag.id === b.id);
    const countA = activeCounts[idxA];
    const countB = activeCounts[idxB];
    if (countA !== countB) return countA - countB;
    const timeA = a.lastAssignedAt ? a.lastAssignedAt.getTime() : 0;
    const timeB = b.lastAssignedAt ? b.lastAssignedAt.getTime() : 0;
    return timeA - timeB;
  })[0];

  if (!selected) return false;

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { currentAgentId: selected.id, status: 'ASSIGNED' } }),
    prisma.orderAssignment.create({ data: { orderId, agentId: selected.id, assignedByUserId, assignmentType: 'AUTO' } }),
    prisma.trackingHistory.create({
      data: {
        orderId,
        previousStatus: order.status,
        newStatus: 'ASSIGNED',
        changedByUserId: assignedByUserId,
        actorRole: 'SYSTEM',
        remarks: 'Auto assigned to available agent'
      }
    }),
    prisma.deliveryAgent.update({ where: { id: selected.id }, data: { lastAssignedAt: new Date() } })
  ]);

  return true;
}

export async function manualAssignAgent(orderId: string, agentId: string, assignedByUserId: string): Promise<void> {
  const agent = await prisma.deliveryAgent.findUnique({ where: { id: agentId } });
  if (!agent || !agent.isAvailable) throw new AppError(400, 'AGENT_UNAVAILABLE', 'Agent is not available');
  
  const count = await getActiveOrderCount(agentId);
  if (count >= agent.maxConcurrentOrders) throw new AppError(400, 'AGENT_FULL', 'Agent is at max capacity');

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { currentAgentId: agentId, status: 'ASSIGNED' } }),
    prisma.orderAssignment.create({ data: { orderId, agentId, assignedByUserId, assignmentType: 'MANUAL' } }),
    prisma.trackingHistory.create({
      data: {
        orderId,
        previousStatus: 'CREATED',
        newStatus: 'ASSIGNED',
        changedByUserId: assignedByUserId,
        actorRole: 'ADMIN',
        remarks: 'Manually assigned'
      }
    }),
    prisma.deliveryAgent.update({ where: { id: agentId }, data: { lastAssignedAt: new Date() } })
  ]);
}
