import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowLeft, CheckCircle2, MapPin, PackageCheck, XCircle, Loader2,
  Package, UserRound, Truck, Navigation, Clock, Circle, AlertTriangle, ChevronRight, Phone
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

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

const nextStatus: Record<string, string[]> = {
  ASSIGNED: ['PICKED_UP', 'FAILED'],
  PICKED_UP: ['IN_TRANSIT', 'FAILED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
};

export const AgentOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [failureOpen, setFailureOpen] = useState(false);
  const [failureReason, setFailureReason] = useState('CUSTOMER_UNAVAILABLE');
  
  const { data: order, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['agent-order', id],
    queryFn: () => apiClient.get(`/orders/${id}`).then((res: any) => res.data),
    enabled: Boolean(id),
    refetchInterval: 15000,
  });

  const { data: apiTracking } = useQuery({
    queryKey: ['agent-tracking', id],
    queryFn: () => apiClient.get(`/orders/${id}/tracking`).then((res: any) => res.data),
    enabled: Boolean(id),
    refetchInterval: 15000,
  });

  const tracking: any[] = Array.isArray(apiTracking) ? apiTracking : [];

  const mutation = useMutation({
    mutationFn: (payload: any) => apiClient.patch(`/orders/${id}/status`, payload),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['agent-order', id] });
      queryClient.invalidateQueries({ queryKey: ['agent-tracking', id] });
      queryClient.invalidateQueries({ queryKey: ['agent-orders'] });
      setFailureOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Status update failed'),
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

  const actions = nextStatus[order.status] || [];
  const isFailed = order.status === 'FAILED';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-24">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to route
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
            <p className="text-surface-600 m-0 font-medium">{order.pickupAddress?.city} → {order.dropAddress?.city}</p>
            <p className="text-xs text-surface-400 mt-2 font-medium">Live sync • {new Date(dataUpdatedAt).toLocaleTimeString()}</p>
          </div>
          <div className="rounded-lg bg-white/60 border border-surface-200 p-3">
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wide mb-1">Collection</p>
            <p className="font-bold text-surface-900 text-lg">
              {order.paymentType === 'COD' ? `₹${order.totalCharge?.toFixed(2)}` : 'Prepaid (Collect ₹0)'}
            </p>
          </div>
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
                      width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone ? 'var(--color-success-500)' : isActive ? 'var(--color-primary-600)' : 'var(--color-surface-100)',
                      border: `2px solid ${isDone ? 'var(--color-success-500)' : isActive ? 'var(--color-primary-600)' : 'var(--color-surface-200)'}`,
                      boxShadow: isActive ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                    }}>
                      {isDone ? <CheckCircle2 size={16} color="white" /> : <Icon size={14} color={isActive ? 'white' : 'var(--color-surface-400)'} />}
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

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <AddressCard title="Pickup Location" address={order.pickupAddress} type="pickup" />
          <AddressCard title="Drop Location" address={order.dropAddress} type="drop" />
        </div>
        
        {/* Tracking Timeline */}
        <section className="glass-panel p-5 rounded-xl border border-surface-200 shadow-sm bg-white">
          <h2 className="font-bold text-surface-900 text-lg border-b border-surface-100 pb-3 mb-4">Event Log</h2>
          {tracking.length === 0 ? (
            <p className="text-surface-500 text-center py-4">No events yet</p>
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
                      <p style={{
                        fontWeight: 700, fontSize: '0.875rem', margin: '0 0 0.125rem',
                        color: isFail ? 'var(--color-danger-600)' : isSuccess ? 'var(--color-success-600)' : 'var(--color-surface-900)'
                      }}>
                        {statusLabel(item.newStatus || item.status)}
                      </p>
                      <p className="text-xs text-surface-500 m-0">{new Date(item.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</p>
                      {item.remarks && <p className="text-sm text-surface-600 mt-1 mb-0">{item.remarks}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Action Footer Bar ─────────────────────────────────── */}
      {actions.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'var(--color-bg-white)', borderTop: '1px solid var(--color-surface-200)',
          padding: '1rem', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        }}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3 justify-end">
            {actions.includes('FAILED') && (
              <Button 
                variant="danger" 
                onClick={() => setFailureOpen(true)} 
                className="w-full sm:w-auto px-6 py-3 font-bold"
              >
                <XCircle size={18} />
                Report Issue
              </Button>
            )}
            {actions.filter(s => s !== 'FAILED').map(status => (
              <Button 
                key={status} 
                onClick={() => mutation.mutate({ status, remarks: `Agent marked as ${status.replaceAll('_', ' ').toLowerCase()}` })} 
                isLoading={mutation.isPending} 
                className="btn-primary w-full sm:w-auto px-8 py-3 shadow-lg shadow-primary-500/20 font-bold"
              >
                <CheckCircle2 size={18} />
                Mark {statusLabel(status)}
                <ChevronRight size={18} />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* ── Failure Modal ─────────────────────────────────────── */}
      <Modal isOpen={failureOpen} onClose={() => setFailureOpen(false)} title="Report Delivery Issue">
        <div className="space-y-5 mt-2">
          <p className="text-surface-600 text-sm">Please select the reason for failure. This will trigger a reschedule request for the customer.</p>
          <Select label="Reason for failure" value={failureReason} onChange={(e) => setFailureReason(e.target.value)} options={[
            { value: 'CUSTOMER_UNAVAILABLE', label: 'Customer unavailable / no response' },
            { value: 'ADDRESS_NOT_FOUND', label: 'Address not found or incomplete' },
            { value: 'PAYMENT_DECLINED', label: 'Payment declined (COD)' },
            { value: 'REJECTED_BY_CUSTOMER', label: 'Order rejected by customer' },
          ]} className="w-full" />
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
            <Button variant="outline" onClick={() => setFailureOpen(false)} className="px-6 font-semibold">Cancel</Button>
            <Button variant="danger" isLoading={mutation.isPending} onClick={() => mutation.mutate({ status: 'FAILED', failureReason, remarks: failureReason.replaceAll('_', ' ').toLowerCase() })} className="px-6 font-bold shadow-lg shadow-danger-500/20">
              Confirm Failure
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const AddressCard = ({ title, address, type }: any) => (
  <section className="glass-panel p-5 relative overflow-hidden shadow-sm rounded-xl border border-surface-200 bg-white">
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
      <MapPin size={100} />
    </div>
    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-4 flex items-center gap-3 border-b border-surface-100 pb-3">
        <div className={`rounded-lg p-2 flex items-center justify-center ${type === 'pickup' ? 'bg-primary-50 text-primary-600' : 'bg-success-50 text-success-600'}`}>
          <MapPin size={20} />
        </div>
        <h2 className="font-bold text-surface-900 text-lg m-0">{title}</h2>
      </div>
      <p className="font-bold text-surface-900 text-lg mb-1">{address?.contactName}</p>
      <p className="text-surface-600 font-medium text-sm leading-relaxed mb-4 flex-1">
        {address?.line1}{address?.line2 ? `, ${address.line2}` : ''} <br/>
        {address?.city}, {address?.state} - {address?.pincode}
      </p>
      {address?.contactPhone && (
        <a href={`tel:${address.contactPhone}`} className="inline-flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-4 py-2 rounded-lg w-fit hover:bg-primary-100 transition-colors no-underline">
          <Phone size={16} /> Call {address.contactPhone}
        </a>
      )}
    </div>
  </section>
);
