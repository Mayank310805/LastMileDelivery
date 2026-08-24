import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowLeft, RadioTower, ShieldAlert, Loader2, UserCheck,
  Package, UserRound, Truck, Navigation, Clock, PackageCheck, CheckCircle2, Circle, AlertTriangle
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';

/* ── Status helpers ────────────────────────────────────────────── */
export const statusLabel = (status?: string) =>
  (status || 'CREATED').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (m: string) => m.toUpperCase());

const ORDER_PIPELINE = [
  { key: 'CREATED',          label: 'Order Placed',     icon: Package },
  { key: 'ASSIGNED',         label: 'Assigned',         icon: UserRound },
  { key: 'PICKED_UP',        label: 'Picked Up',        icon: Truck },
  { key: 'IN_TRANSIT',       label: 'In Transit',       icon: Navigation },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Clock },
  { key: 'DELIVERED',        label: 'Delivered',        icon: PackageCheck },
];
const PIPELINE_KEYS = ORDER_PIPELINE.map(s => s.key);

const getStatusIndex = (status: string) => {
  if (status === 'FAILED') return -1;
  if (status === 'RESCHEDULED') return 1;
  return PIPELINE_KEYS.indexOf(status);
};

const statusColor = (key: string, currentStatus: string) => {
  if (currentStatus === 'FAILED') return 'failed';
  const currentIdx = getStatusIndex(currentStatus);
  const stepIdx = PIPELINE_KEYS.indexOf(key);
  if (stepIdx < currentIdx) return 'done';
  if (stepIdx === currentIdx) return 'active';
  return 'pending';
};

export const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [status, setStatus] = useState('IN_TRANSIT');
  const [remark, setRemark] = useState('Admin operational override');
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const { data: order, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => apiClient.get(`/orders/${id}`).then((res: any) => res.data),
    enabled: Boolean(id),
    refetchInterval: 15000,
  });

  const { data: apiTracking } = useQuery({
    queryKey: ['admin-tracking', id],
    queryFn: () => apiClient.get(`/orders/${id}/tracking`).then((res: any) => res.data),
    enabled: Boolean(id),
    refetchInterval: 15000,
  });

  const tracking: any[] = Array.isArray(apiTracking) ? apiTracking : [];

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
      queryClient.invalidateQueries({ queryKey: ['admin-tracking', id] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Auto-assignment failed'),
  });

  const manualAssign = useMutation({
    mutationFn: () => apiClient.post(`/admin/orders/${id}/assign`, { agentId: selectedAgentId }),
    onSuccess: () => {
      toast.success('Agent manually assigned!');
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-tracking', id] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Manual assignment failed'),
  });

  const override = useMutation({
    mutationFn: () => apiClient.patch(`/admin/orders/${id}/status`, { status, remark }),
    onSuccess: () => {
      toast.success('Status override recorded');
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-tracking', id] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Override failed'),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col gap-4 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        <p className="text-surface-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-20">
        <Package size={48} className="mx-auto text-surface-300 mb-4" />
        <h2 className="text-2xl font-bold text-surface-900">Order not found</h2>
        <Button className="mt-4 btn-primary" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const isFailed = order.status === 'FAILED';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to Administration
      </button>

      {/* ── Header ────────────────────────────────────────────── */}
      <section style={{
        background: isFailed ? 'linear-gradient(135deg, #FEF2F2, var(--color-bg-white))' :
                    isDelivered ? 'linear-gradient(135deg, #F0FDF4, var(--color-bg-white))' :
                    'linear-gradient(135deg, #EFF6FF, var(--color-bg-white))',
        border: `1px solid ${isFailed ? 'var(--color-danger-100)' : isDelivered ? '#BBF7D0' : 'var(--color-primary-100)'}`,
        borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-surface-950 m-0">{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-surface-600 m-0 font-medium">{order.pickupAddress?.pincode} → {order.dropAddress?.pincode} &nbsp;·&nbsp; ₹{order.totalCharge?.toFixed(2)}</p>
            <p className="text-xs text-surface-400 mt-2 font-medium">Live sync • {new Date(dataUpdatedAt).toLocaleTimeString()}</p>
          </div>
          <Button onClick={() => autoAssign.mutate()} isLoading={autoAssign.isPending} className="btn-secondary shadow-sm">
            <RadioTower size={16} />
            Force Auto-assign
          </Button>
        </div>
      </section>

      {/* ── Visual Pipeline ───────────────────────────────────── */}
      {!isFailed && (
        <div className="glass-panel p-5 rounded-xl border border-surface-200 shadow-sm bg-white overflow-x-auto">
          <div className="flex items-start pb-2" style={{ minWidth: '600px' }}>
            {ORDER_PIPELINE.map((step, index) => {
              const color = statusColor(step.key, order.status);
              const isDone = color === 'done';
              const isActive = color === 'active';
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-center" style={{ flex: index < ORDER_PIPELINE.length - 1 ? 1 : undefined }}>
                  <div className="flex flex-col items-center gap-2 min-w-[5rem]">
                    <div style={{
                      width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center',
                      background: isDone ? 'var(--color-success-500)' : isActive ? 'var(--color-primary-600)' : 'var(--color-surface-100)',
                      border: `2px solid ${isDone ? 'var(--color-success-500)' : isActive ? 'var(--color-primary-600)' : 'var(--color-surface-200)'}`,
                      boxShadow: isActive ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                    }}>
                      {isDone ? <CheckCircle2 size={16} color="white" /> : <Icon size={14} color={isActive ? 'white' : 'var(--color-surface-400)'} className="m-auto" />}
                    </div>
                    <p style={{
                      fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, margin: 0, whiteSpace: 'nowrap',
                      color: isDone ? 'var(--color-success-600)' : isActive ? 'var(--color-primary-600)' : 'var(--color-surface-400)',
                    }}>
                      {step.label}
                    </p>
                  </div>
                  {index < ORDER_PIPELINE.length - 1 && (
                    <div style={{
                      flex: 1, height: '2px', margin: '0 0.25rem', marginBottom: '1.25rem',
                      background: isDone ? 'var(--color-success-500)' : 'var(--color-surface-200)'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Operations Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-6">
          {/* Order Intelligence */}
          <section className="glass-panel p-6 shadow-sm rounded-xl border border-surface-200 bg-white">
            <h2 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-3 mb-5">Order Intelligence</h2>
            <div className="grid grid-cols-2 gap-4">
              <Metric label="Current agent" value={order.currentAgent?.user?.name || 'Unassigned'} />
              <Metric label="Payment" value={order.paymentType} />
              <Metric label="Billable weight" value={`${order.billableWeightKg || 0} kg`} />
              <Metric label="Route" value={`${order.pickupAddress?.city || '-'} → ${order.dropAddress?.city || '-'}`} />
            </div>
          </section>

          {/* Manual Agent Assignment */}
          <section className="glass-panel p-6 shadow-sm rounded-xl border border-surface-200 bg-white">
            <div className="flex items-center gap-2 border-b border-surface-100 pb-3 mb-5">
              <UserCheck size={18} className="text-primary-600" />
              <h2 className="font-bold text-surface-900 text-lg">Manual Assignment</h2>
            </div>
            <div className="flex flex-col gap-4">
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
                className="btn-primary shadow-sm"
                onClick={() => manualAssign.mutate()}
                isLoading={manualAssign.isPending}
                disabled={!selectedAgentId}
              >
                <UserCheck size={16} /> Assign driver
              </Button>
            </div>
          </section>

          {/* Status Override */}
          <section className="glass-panel p-6 shadow-sm rounded-xl border border-danger-200 bg-danger-50/10">
            <div className="flex items-center gap-2 border-b border-danger-100 pb-3 mb-5">
              <ShieldAlert size={18} className="text-danger-600" />
              <h2 className="font-bold text-danger-900 text-lg">Administrative Override</h2>
            </div>
            <div className="flex flex-col gap-4">
              <Select
                label="Force new status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                options={['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RESCHEDULED'].map(v => ({ value: v, label: v.replaceAll('_', ' ') }))}
              />
              <Input label="Required audit remark" value={remark} onChange={e => setRemark(e.target.value)} />
              <Button fullWidth onClick={() => override.mutate()} isLoading={override.isPending} variant="danger" className="shadow-sm font-bold">
                <ShieldAlert size={16} /> Record Override
              </Button>
            </div>
          </section>
        </div>

        {/* Tracking Timeline Log */}
        <section className="glass-panel p-6 rounded-xl border border-surface-200 shadow-sm bg-white h-full max-h-[850px] overflow-y-auto">
          <h2 className="font-bold text-surface-900 text-lg border-b border-surface-100 pb-3 mb-5">System Audit Log</h2>
          {tracking.length === 0 ? (
            <p className="text-surface-500 text-center py-4">No tracking history recorded</p>
          ) : (
            <div className="flex flex-col gap-0">
              {[...tracking].reverse().map((item: any, index: number) => {
                const isFail = item.newStatus === 'FAILED';
                const isSuccess = item.newStatus === 'DELIVERED';
                return (
                  <div key={item.id} className="flex gap-4 relative">
                    <div className="flex flex-col items-center shrink-0">
                      <div style={{
                        width: '1.75rem', height: '1.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isFail ? 'var(--color-danger-50)' : isSuccess ? '#F0FDF4' : 'var(--color-primary-50)',
                        border: `2px solid ${isFail ? 'var(--color-danger-200)' : isSuccess ? '#BBF7D0' : 'var(--color-primary-200)'}`, zIndex: 1
                      }}>
                        {isFail ? <AlertTriangle size={12} color="var(--color-danger-500)" /> : isSuccess ? <CheckCircle2 size={12} color="var(--color-success-500)" /> : <Circle size={8} className="text-primary-500 fill-primary-500" />}
                      </div>
                      {index < tracking.length - 1 && <div className="w-0.5 flex-1 min-h-[1.5rem] bg-surface-200 my-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-center mb-1">
                        <p style={{
                          fontWeight: 700, fontSize: '0.875rem', margin: 0,
                          color: isFail ? 'var(--color-danger-600)' : isSuccess ? 'var(--color-success-600)' : 'var(--color-surface-900)'
                        }}>
                          {statusLabel(item.newStatus || item.status)}
                        </p>
                        <span className="text-[10px] font-bold tracking-wider text-surface-400 bg-surface-100 px-2 py-0.5 rounded-full uppercase border border-surface-200">
                          {item.actorRole || 'SYSTEM'}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500 m-0">{new Date(item.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</p>
                      {item.remarks && <p className="text-sm text-surface-600 mt-2 mb-0 bg-surface-50 p-2 rounded-md border border-surface-100">{item.remarks}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-surface-50 border border-surface-200 rounded-lg p-3">
    <p className="text-xs font-bold text-surface-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="font-semibold text-surface-900 m-0 text-sm">{value}</p>
  </div>
);
