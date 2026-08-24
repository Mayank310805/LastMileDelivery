import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, RadioTower, ShieldAlert, Loader2, UserCheck } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('IN_TRANSIT');
  const [remark, setRemark] = useState('Admin operational override');
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => apiClient.get(`/orders/${id}`).then((res: any) => res.data),
    enabled: Boolean(id),
  });

  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: () => apiClient.get('/agents').then((res: any) => res.data),
  });

  const agents = Array.isArray(agentsData) ? agentsData : [];

  const autoAssign = useMutation({
    mutationFn: () => apiClient.post(`/admin/orders/${id}/auto-assign`),
    onSuccess: () => {
      toast.success('Auto-assignment triggered');
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Auto-assignment failed'),
  });

  const manualAssign = useMutation({
    mutationFn: () => apiClient.post(`/admin/orders/${id}/assign`, { agentId: selectedAgentId }),
    onSuccess: () => {
      toast.success('Agent manually assigned!');
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Manual assignment failed'),
  });

  const override = useMutation({
    mutationFn: () => apiClient.patch(`/admin/orders/${id}/status`, { status, remark }),
    onSuccess: () => {
      toast.success('Status override recorded');
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Override failed'),
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '16rem', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '2rem', height: '2rem', color: 'var(--color-primary-600)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>Order not found</h2>
        <Button style={{ marginTop: '1rem' }} className="btn btn-primary" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-500)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', marginBottom: '1rem' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--color-surface-900)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--color-surface-500)')}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-surface-500)' }}>
              {order.pickupAddress?.pincode} → {order.dropAddress?.pincode} &nbsp;·&nbsp; ₹{order.totalCharge?.toFixed(2)}
            </p>
          </div>
          <Button onClick={() => autoAssign.mutate()} isLoading={autoAssign.isPending} className="btn btn-secondary">
            <RadioTower size={16} style={{ marginRight: '0.5rem' }} /> Auto-assign
          </Button>
        </div>
      </section>

      <section style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '1.5rem' }}>
        {/* Order Intelligence */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-surface-900)', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Order Intelligence</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Metric label="Current agent" value={order.currentAgent?.user?.name || 'Unassigned'} />
            <Metric label="Payment" value={order.paymentType} />
            <Metric label="Billable weight" value={`${order.billableWeightKg || 0} kg`} />
            <Metric label="Route" value={`${order.pickupAddress?.city || '-'} → ${order.dropAddress?.city || '-'}`} />
          </div>
        </div>

        {/* Manual Agent Assignment */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <UserCheck size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 style={{ fontWeight: 600, color: 'var(--color-surface-900)', fontSize: '1.125rem' }}>Manual Assignment</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Select
              label="Choose a driver"
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              options={agents.map((a: any) => ({
                value: a.id,
                label: `${a.user?.name ?? 'Agent'} — ${a.currentZone?.name ?? 'No zone'} (${a.isAvailable ? '✅ Available' : '🔴 Busy'})`
              }))}
            />
            <Button
              fullWidth
              className="btn btn-primary"
              onClick={() => manualAssign.mutate()}
              isLoading={manualAssign.isPending}
              disabled={!selectedAgentId}
            >
              <UserCheck size={16} style={{ marginRight: '0.5rem' }} /> Assign this driver
            </Button>
          </div>
        </div>

        {/* Status Override */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <ShieldAlert size={18} style={{ color: 'var(--color-danger-600)' }} />
            <h2 style={{ fontWeight: 600, color: 'var(--color-surface-900)', fontSize: '1.125rem' }}>Status Override</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Select
              label="New status"
              value={status}
              onChange={e => setStatus(e.target.value)}
              options={['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RESCHEDULED'].map(v => ({ value: v, label: v.replaceAll('_', ' ') }))}
            />
            <Input label="Required remark" value={remark} onChange={e => setRemark(e.target.value)} />
            <Button fullWidth onClick={() => override.mutate()} isLoading={override.isPending} className="btn btn-danger">
              Record override
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-200)', background: 'var(--color-surface-50)', padding: '0.75rem' }}>
    <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-surface-500)' }}>{label}</p>
    <p style={{ marginTop: '0.25rem', fontWeight: 500, color: 'var(--color-surface-900)', fontSize: '0.875rem' }}>{value}</p>
  </div>
);
