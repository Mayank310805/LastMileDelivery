import { agentUpdateStatus, adminOverrideStatus } from '../status-update.service';
import prisma from '../../../config/database';
import { validateTransition } from '../../tracking/status-machine';
import { sendNotification } from '../../notifications/notification.service';

jest.mock('../../../config/database', () => ({
  __esModule: true,
  default: {
    order: { findUnique: jest.fn(), update: jest.fn() },
    deliveryAgent: { findUnique: jest.fn() },
    trackingHistory: { create: jest.fn() },
    $transaction: jest.fn(async (ops) => {
      for (const op of ops) await op;
    })
  }
}));

jest.mock('../../tracking/status-machine', () => ({
  validateTransition: jest.fn()
}));

jest.mock('../../notifications/notification.service', () => ({
  sendNotification: jest.fn()
}));

describe('Status Update Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('agentUpdateStatus', () => {
    it('allows an assigned agent to update status and sends notification', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue({ 
        id: 'order-1', status: 'ASSIGNED', currentAgentId: 'agent-1', customerId: 'cust-1' 
      });
      (prisma.deliveryAgent.findUnique as jest.Mock).mockResolvedValue({ id: 'agent-1' });

      await agentUpdateStatus('order-1', 'agent-user', 'PICKED_UP');

      expect(validateTransition).toHaveBeenCalledWith('ASSIGNED', 'PICKED_UP', false);
      expect(prisma.order.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: 'PICKED_UP' } }));
      expect(prisma.trackingHistory.create).toHaveBeenCalled();
      expect(sendNotification).toHaveBeenCalledWith('cust-1', 'order-1', 'PICKED_UP', expect.any(Object));
    });

    it('rejects if the agent is not assigned to the order', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue({ 
        id: 'order-1', status: 'ASSIGNED', currentAgentId: 'agent-1' 
      });
      (prisma.deliveryAgent.findUnique as jest.Mock).mockResolvedValue({ id: 'agent-2' });

      await expect(agentUpdateStatus('order-1', 'agent-user', 'PICKED_UP')).rejects.toThrow('Not assigned to this order');
    });

    it('rejects FAILED status without a failure reason', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue({ 
        id: 'order-1', status: 'OUT_FOR_DELIVERY', currentAgentId: 'agent-1' 
      });
      (prisma.deliveryAgent.findUnique as jest.Mock).mockResolvedValue({ id: 'agent-1' });

      await expect(agentUpdateStatus('order-1', 'agent-user', 'FAILED')).rejects.toThrow('Failure reason required');
    });
  });

  describe('adminOverrideStatus', () => {
    it('allows admin to override status with a remark', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue({ 
        id: 'order-1', status: 'CREATED', customerId: 'cust-1' 
      });

      await adminOverrideStatus('order-1', 'admin-1', 'DELIVERED', 'Test override');

      expect(validateTransition).toHaveBeenCalledWith('CREATED', 'DELIVERED', true);
      expect(prisma.order.update).toHaveBeenCalledWith(expect.objectContaining({ 
        data: { status: 'DELIVERED', deliveredAt: expect.any(Date) } 
      }));
      expect(prisma.trackingHistory.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ isOverride: true, remarks: 'Test override' })
      }));
    });

    it('rejects admin override without a remark', async () => {
      await expect(adminOverrideStatus('order-1', 'admin-1', 'DELIVERED', '')).rejects.toThrow('Remark required');
    });
  });
});
