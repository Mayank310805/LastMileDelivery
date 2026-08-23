import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';
import bcrypt from 'bcryptjs';

export const toggleAvailability = async (agentUserId: string, isAvailable: boolean) => {
  const agent = await prisma.deliveryAgent.findUnique({ where: { userId: agentUserId } });
  if (!agent) throw new AppError(404, 'AGENT_NOT_FOUND', 'Agent not found');
  return prisma.deliveryAgent.update({ where: { id: agent.id }, data: { isAvailable } });
};

export const updateLocation = async (agentUserId: string, data: any) => {
  const agent = await prisma.deliveryAgent.findUnique({ where: { userId: agentUserId } });
  if (!agent) throw new AppError(404, 'AGENT_NOT_FOUND', 'Agent not found');
  return prisma.deliveryAgent.update({
    where: { id: agent.id },
    data: { currentZoneId: data.currentZoneId, currentLat: data.currentLat, currentLng: data.currentLng, lastLocationUpdateAt: new Date() }
  });
};

export const getAssignedOrders = async (agentUserId: string, statusFilter?: string) => {
  const agent = await prisma.deliveryAgent.findUnique({ where: { userId: agentUserId } });
  if (!agent) throw new AppError(404, 'AGENT_NOT_FOUND', 'Agent not found');
  const where: any = { currentAgentId: agent.id };
  if (statusFilter) where.status = statusFilter;
  return prisma.order.findMany({ where, orderBy: { createdAt: 'desc' } });
};

export const listAgents = async () => {
  const agents = await prisma.deliveryAgent.findMany({ include: { user: true } });
  return agents;
};

export const createAgent = async (data: any) => {
  const passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name: data.name, email: data.email, phone: data.phone, passwordHash, role: 'AGENT' }
    });
    const agent = await tx.deliveryAgent.create({
      data: { userId: user.id, currentZoneId: data.currentZoneId, isAvailable: true }
    });
    return { user, agent };
  });
};

export const updateAgent = async (id: string, data: any) => {
  return prisma.deliveryAgent.update({ where: { id }, data });
};
