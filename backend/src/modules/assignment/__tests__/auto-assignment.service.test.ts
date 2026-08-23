import { autoAssignAgent, getActiveOrderCount } from '../auto-assignment.service';
import prisma from '../../../config/database';

jest.mock('../../../config/database', () => ({
  __esModule: true,
  default: {
    order: { findUnique: jest.fn(), count: jest.fn(), update: jest.fn() },
    deliveryAgent: { findMany: jest.fn(), update: jest.fn() },
    orderAssignment: { create: jest.fn() },
    trackingHistory: { create: jest.fn() },
    $transaction: jest.fn(async (ops) => {
      for (const op of ops) {
        await op;
      }
    })
  }
}));

describe('Auto Assignment Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing if no order is found or status is not CREATED/RESCHEDULED', async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({ status: 'IN_TRANSIT' });
    const result = await autoAssignAgent('order-1', 'admin-1');
    expect(result).toBe(false);
    expect(prisma.deliveryAgent.findMany).not.toHaveBeenCalled();
  });

  it('selects agent with lowest active order count in the same zone', async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({ 
      id: 'order-1', 
      status: 'CREATED', 
      pickupZoneId: 'zone-north' 
    });

    const mockAgents = [
      { id: 'agent-1', isAvailable: true, currentZoneId: 'zone-north', maxConcurrentOrders: 5 },
      { id: 'agent-2', isAvailable: true, currentZoneId: 'zone-north', maxConcurrentOrders: 5 },
      { id: 'agent-3', isAvailable: true, currentZoneId: 'zone-south', maxConcurrentOrders: 5 } // Wrong zone
    ];

    (prisma.deliveryAgent.findMany as jest.Mock).mockResolvedValue(mockAgents);

    // active counts: agent-1 has 3, agent-2 has 1, agent-3 has 0
    (prisma.order.count as jest.Mock).mockImplementation(async ({ where }) => {
      if (where.currentAgentId === 'agent-1') return 3;
      if (where.currentAgentId === 'agent-2') return 1;
      if (where.currentAgentId === 'agent-3') return 0;
      return 0;
    });

    const result = await autoAssignAgent('order-1', 'admin-1');
    expect(result).toBe(true);

    // Should have selected agent-2 (lowest load in zone-north)
    expect(prisma.order.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'order-1' },
      data: expect.objectContaining({ currentAgentId: 'agent-2', status: 'ASSIGNED' })
    }));
  });

  it('falls back to agents out of zone if no zone agents are available', async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({ 
      id: 'order-1', 
      status: 'CREATED', 
      pickupZoneId: 'zone-north' 
    });

    const mockAgents = [
      { id: 'agent-3', isAvailable: true, currentZoneId: 'zone-south', maxConcurrentOrders: 5 }
    ];

    (prisma.deliveryAgent.findMany as jest.Mock).mockResolvedValue(mockAgents);
    (prisma.order.count as jest.Mock).mockResolvedValue(0); // 0 active orders

    const result = await autoAssignAgent('order-1', 'admin-1');
    expect(result).toBe(true);

    // Should have selected agent-3 even though they are in zone-south
    expect(prisma.order.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ currentAgentId: 'agent-3' })
    }));
  });

  it('fails if all agents are at max concurrent orders', async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({ 
      id: 'order-1', 
      status: 'CREATED', 
      pickupZoneId: 'zone-north' 
    });

    const mockAgents = [
      { id: 'agent-1', isAvailable: true, currentZoneId: 'zone-north', maxConcurrentOrders: 5 }
    ];

    (prisma.deliveryAgent.findMany as jest.Mock).mockResolvedValue(mockAgents);
    (prisma.order.count as jest.Mock).mockResolvedValue(5); // At capacity

    const result = await autoAssignAgent('order-1', 'admin-1');
    expect(result).toBe(false);
    expect(prisma.order.update).not.toHaveBeenCalled();
  });
});
