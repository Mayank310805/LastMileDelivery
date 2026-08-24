import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, MapPin, Package, UserRound, Loader2,
  CheckCircle2, Circle, AlertTriangle, Clock, RotateCcw,
  Truck, Navigation, PackageCheck, CalendarDays, Phone,
  RefreshCw, X, Calendar, Info, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../../lib/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';

/* ── Status helpers ────────────────────────────────────────────── */
export const statusLabel = (status?: string) =>
  (status || 'CREATED').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (m: string) => m.toUpperCase());

const ORDER_PIPELINE: { key: string; label: string; icon: any; description: string }[] = [
  { key: 'CREATED',          label: 'Order Placed',     icon: Package,      description: 'Your order has been created and is awaiting pickup.' },
  { key: 'ASSIGNED',         label: 'Agent Assigned',   icon: UserRound,    description: 'A delivery agent has been assigned to your order.' },
  { key: 'PICKED_UP',        label: 'Picked Up',        icon: Truck,        description: 'Your package has been picked up by the agent.' },
  { key: 'IN_TRANSIT',       label: 'In Transit',       icon: Navigation,   description: 'Your package is on its way to the destination.' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Clock,        description: 'Your package is out for delivery. Expect it soon!' },
  { key: 'DELIVERED',        label: 'Delivered',        icon: PackageCheck, description: 'Package successfully delivered.' },
];

const PIPELINE_KEYS = ORDER_PIPELINE.map(s => s.key);

const getStatusIndex = (status: string) => {
  if (status === 'FAILED') return -1;
  if (status === 'RESCHEDULED') return 1; // show as "assigned" step pending
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

/* ── Inline Reschedule Modal ─────────────────────────────────── */
const RescheduleModal = ({ orderId, onClose }: { orderId: string; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [date, setDate] = useState(tomorrow);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      apiClient.post(`/orders/${orderId}/reschedule`, { newScheduledDate: new Date(date).toISOString() }),
    onSuccess: () => {
      toast.success('Delivery rescheduled! Auto-assignment will begin shortly.');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['tracking', orderId] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Could not reschedule delivery');
    },
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--color-bg-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
        width: '100%', maxWidth: '28rem', padding: '2rem', animation: 'scaleIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', background: 'var(--color-warning-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={20} color="var(--color-warning-600)" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-surface-900)', margin: 0 }}>Reschedule Delivery</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-surface-500)', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--color-surface-600)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Choose a new delivery date. The system will clear the current agent and trigger automatic reassignment.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-surface-700)', marginBottom: '0.5rem' }}>
            New Delivery Date
          </label>
          <input
            type="date"
            min={tomorrow}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%', padding: '0.625rem 0.875rem', border: '1px solid var(--color-surface-300)',
              borderRadius: 'var(--radius-md)', fontSize: '1rem', background: 'var(--color-bg-white)',
              color: 'var(--color-surface-900)', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{
          background: 'var(--color-warning-50)', border: '1px solid var(--color-warning-100)',
          borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', marginBottom: '1.5rem',
          display: 'flex', gap: '0.625rem',
        }}>
          <Info size={16} color="var(--color-warning-600)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-warning-700)', margin: 0, lineHeight: 1.5 }}>
            Reschedules are limited to <strong>3 attempts</strong> per order and are permanently recorded in the tracking timeline.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-300)',
            background: 'var(--color-surface-100)', color: 'var(--color-surface-700)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9375rem',
          }}>Cancel</button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: 'none',
              background: isPending ? 'var(--color-primary-400)' : 'var(--color-primary-600)',
              color: 'white', fontWeight: 700, cursor: isPending ? 'not-allowed' : 'pointer', fontSize: '0.9375rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {isPending ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Calendar size={16} /> Confirm</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────────── */
export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showReschedule, setShowReschedule] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiClient.get(`/orders/${id}`).then((res: any) => res.data),
    enabled: Boolean(id),
    refetchInterval: 30000, // live poll every 30s
  });

  const { data: apiTracking, dataUpdatedAt } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => apiClient.get(`/orders/${id}/tracking`).then((res: any) => res.data),
    enabled: Boolean(id),
    refetchInterval: 15000, // live poll every 15s for tracking
  });

  const tracking: any[] = Array.isArray(apiTracking) ? apiTracking : [];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '20rem', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={36} color="var(--color-primary-500)" />
        <p style={{ color: 'var(--color-surface-500)', fontWeight: 500 }}>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <Package size={48} color="var(--color-surface-300)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-surface-900)' }}>Order not found</h2>
        <Button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const isFailed = order.status === 'FAILED';
  const isRescheduled = order.status === 'RESCHEDULED';
  const isDelivered = order.status === 'DELIVERED';
  const currentStepIndex = getStatusIndex(order.status);

  // Get the failure reason from the last tracking entry
  const failureEntry = tracking.slice().reverse().find((t: any) => t.newStatus === 'FAILED' || t.previousStatus === 'FAILED');
  const failureReason = failureEntry?.remarks;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.4s ease' }}>
      {showReschedule && <RescheduleModal orderId={id!} onClose={() => setShowReschedule(false)} />}

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div style={{
        background: isFailed ? 'linear-gradient(135deg, #FEF2F2, var(--color-bg-white))' :
                    isDelivered ? 'linear-gradient(135deg, #F0FDF4, var(--color-bg-white))' :
                    'linear-gradient(135deg, #EFF6FF, var(--color-bg-white))',
        border: `1px solid ${isFailed ? 'var(--color-danger-100)' : isDelivered ? '#BBF7D0' : 'var(--color-surface-200)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-surface-500)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-surface-900)', margin: 0 }}>
                {order.orderNumber}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p style={{ color: 'var(--color-surface-600)', fontSize: '1rem', margin: 0 }}>
              {order.orderType} · {order.paymentType} · ₹{order.totalCharge?.toFixed(2)}
            </p>
            <p style={{ color: 'var(--color-surface-400)', fontSize: '0.8125rem', margin: '0.375rem 0 0', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <RefreshCw size={12} />
              Live — last updated {new Date(dataUpdatedAt).toLocaleTimeString()}
            </p>
          </div>

          {isFailed && (
            <button
              onClick={() => setShowReschedule(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                background: 'var(--color-primary-600)', color: 'white', border: 'none',
                borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem',
                fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              }}
            >
              <RotateCcw size={18} /> Reschedule Delivery
            </button>
          )}
        </div>
      </div>

      {/* ── Failed Delivery Banner ─────────────────────────────── */}
      {isFailed && (
        <div style={{
          background: 'var(--color-danger-50)', border: '1px solid var(--color-danger-100)',
          borderLeft: '4px solid var(--color-danger-500)', borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
        }}>
          <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={22} color="var(--color-danger-500)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--color-danger-700)', margin: '0 0 0.375rem', fontSize: '1.0625rem' }}>
                Delivery Attempt Failed
              </h3>
              <p style={{ color: 'var(--color-danger-600)', margin: 0, lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {failureReason || 'The delivery could not be completed.'} Please reschedule for another date so we can attempt delivery again.
              </p>
              {order.rescheduleCount !== undefined && (
                <p style={{ color: 'var(--color-danger-500)', fontSize: '0.8125rem', margin: '0.5rem 0 0', fontWeight: 600 }}>
                  Reschedule attempts used: {order.rescheduleCount}/3
                </p>
              )}
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-danger-100)' }}>
            <p style={{ color: 'var(--color-danger-600)', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.75rem' }}>
              What to do next:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'Click "Reschedule Delivery" to choose a new date',
                'Ensure someone is available at the drop address to receive the package',
                'Make sure contact number is reachable for the driver to call',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <ChevronRight size={14} color="var(--color-danger-500)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span style={{ color: 'var(--color-danger-700)', fontSize: '0.875rem' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Rescheduled Info Banner ────────────────────────────── */}
      {isRescheduled && (
        <div style={{
          background: 'var(--color-warning-50)', border: '1px solid var(--color-warning-100)',
          borderLeft: '4px solid var(--color-warning-500)', borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem', display: 'flex', gap: '0.875rem',
        }}>
          <CalendarDays size={22} color="var(--color-warning-600)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
          <div>
            <h3 style={{ fontWeight: 700, color: 'var(--color-warning-700)', margin: '0 0 0.25rem', fontSize: '1rem' }}>
              Delivery Rescheduled
            </h3>
            <p style={{ color: 'var(--color-warning-600)', margin: 0, fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Your delivery has been rescheduled.
              {order.scheduledDeliveryDate && ` New date: ${new Date(order.scheduledDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`} Our system is finding the best available agent for reassignment.
            </p>
          </div>
        </div>
      )}

      {/* ── Delivered Success Banner ───────────────────────────── */}
      {isDelivered && (
        <div style={{
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          borderLeft: '4px solid var(--color-success-500)', borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem', display: 'flex', gap: '0.875rem',
        }}>
          <CheckCircle2 size={22} color="var(--color-success-600)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
          <div>
            <h3 style={{ fontWeight: 700, color: 'var(--color-success-700)', margin: '0 0 0.25rem', fontSize: '1rem' }}>
              Package Delivered Successfully 🎉
            </h3>
            <p style={{ color: 'var(--color-success-600)', margin: 0, fontSize: '0.9375rem' }}>
              Your order has been delivered. Thank you for choosing LastMile!
            </p>
          </div>
        </div>
      )}

      {/* ── Visual Status Pipeline ─────────────────────────────── */}
      {!isFailed && (
        <div style={{
          background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)',
          borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontWeight: 700, color: 'var(--color-surface-900)', margin: '0 0 1.75rem', fontSize: '1.125rem' }}>
            Order Status
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {ORDER_PIPELINE.map((step, index) => {
              const color = statusColor(step.key, order.status);
              const isDone = color === 'done';
              const isActive = color === 'active';
              const Icon = step.icon;
              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: index < ORDER_PIPELINE.length - 1 ? 1 : undefined }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem', minWidth: '5rem' }}>
                    <div style={{
                      width: '2.75rem', height: '2.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone ? 'var(--color-success-500)' : isActive ? 'var(--color-primary-600)' : 'var(--color-surface-100)',
                      border: `2px solid ${isDone ? 'var(--color-success-500)' : isActive ? 'var(--color-primary-600)' : 'var(--color-surface-200)'}`,
                      boxShadow: isActive ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                      transition: 'all 0.3s ease',
                    }}>
                      {isDone
                        ? <CheckCircle2 size={18} color="white" />
                        : <Icon size={16} color={isActive ? 'white' : 'var(--color-surface-400)'} />
                      }
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        fontSize: '0.75rem', fontWeight: isActive ? 700 : 500,
                        color: isDone ? 'var(--color-success-600)' : isActive ? 'var(--color-primary-600)' : 'var(--color-surface-400)',
                        margin: 0, whiteSpace: 'nowrap',
                      }}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                  {index < ORDER_PIPELINE.length - 1 && (
                    <div style={{
                      flex: 1, height: '2px', margin: '0 0.375rem', marginBottom: '1.5rem',
                      background: isDone ? 'var(--color-success-500)' : 'var(--color-surface-200)',
                      transition: 'background 0.4s ease',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
          {currentStepIndex >= 0 && (
            <p style={{
              marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)', color: 'var(--color-primary-700)',
              fontSize: '0.875rem', fontWeight: 500, margin: '1rem 0 0',
            }}>
              💡 {ORDER_PIPELINE[currentStepIndex]?.description}
            </p>
          )}
        </div>
      )}

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

        {/* Tracking Timeline */}
        <section style={{
          background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)',
          borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-surface-200)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-surface-900)', margin: 0 }}>
              Tracking Timeline
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-surface-400)', fontWeight: 500 }}>
              {tracking.length} event{tracking.length !== 1 ? 's' : ''}
            </span>
          </div>

          {tracking.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Circle size={40} color="var(--color-surface-300)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--color-surface-500)', fontWeight: 500, margin: 0 }}>No tracking events yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[...tracking].reverse().map((item: any, index: number) => {
                const isFirst = index === 0;
                const isFail = item.newStatus === 'FAILED';
                const isSuccess = item.newStatus === 'DELIVERED';
                return (
                  <div key={item.id || index} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                    {/* Timeline line */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: '2.25rem', height: '2.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: isFail ? 'var(--color-danger-50)' : isSuccess ? '#F0FDF4' : isFirst ? 'var(--color-primary-50)' : 'var(--color-surface-100)',
                        border: `2px solid ${isFail ? 'var(--color-danger-200)' : isSuccess ? '#BBF7D0' : isFirst ? 'var(--color-primary-200)' : 'var(--color-surface-200)'}`,
                        zIndex: 1,
                      }}>
                        {isFail
                          ? <AlertTriangle size={13} color="var(--color-danger-500)" />
                          : isSuccess
                            ? <CheckCircle2 size={13} color="var(--color-success-500)" />
                            : isFirst
                              ? <Circle size={10} color="var(--color-primary-500)" style={{ fill: 'var(--color-primary-500)' }} />
                              : <Circle size={10} color="var(--color-surface-400)" />
                        }
                      </div>
                      {index < tracking.length - 1 && (
                        <div style={{ width: '2px', flex: 1, minHeight: '1.5rem', background: 'var(--color-surface-200)', margin: '0.25rem 0' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: index < tracking.length - 1 ? '1.25rem' : 0 }}>
                      <div style={{
                        background: isFirst ? 'var(--color-primary-50)' : 'var(--color-surface-50)',
                        border: `1px solid ${isFirst ? 'var(--color-primary-100)' : 'var(--color-surface-200)'}`,
                        borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <strong style={{
                            fontSize: '0.9375rem', fontWeight: 700,
                            color: isFail ? 'var(--color-danger-600)' : isSuccess ? 'var(--color-success-600)' : isFirst ? 'var(--color-primary-700)' : 'var(--color-surface-900)',
                          }}>
                            {statusLabel(item.newStatus || item.status)}
                          </strong>
                          <span style={{
                            fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-surface-500)',
                            background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)',
                            padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)',
                          }}>
                            {new Date(item.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {item.remarks && (
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-600)', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
                            {item.remarks}
                          </p>
                        )}
                        <span style={{
                          fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                          color: 'var(--color-surface-400)',
                        }}>
                          {item.actorRole || 'SYSTEM'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Agent Info */}
          <InfoPanel icon={UserRound} title="Assigned Agent"
            accentColor={order.currentAgent ? 'var(--color-primary-600)' : 'var(--color-surface-400)'}>
            {order.currentAgent ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                    background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-700)',
                  }}>
                    {order.currentAgent.user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--color-surface-900)', margin: 0, fontSize: '1rem' }}>
                      {order.currentAgent.user?.name}
                    </p>
                    <p style={{ color: 'var(--color-surface-500)', fontSize: '0.8125rem', margin: 0 }}>Delivery Agent</p>
                  </div>
                </div>
                {order.currentAgent.user?.phone && (
                  <a href={`tel:${order.currentAgent.user.phone}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    color: 'var(--color-primary-600)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                  }}>
                    <Phone size={14} /> {order.currentAgent.user.phone}
                  </a>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-surface-500)' }}>
                <Loader2 size={14} style={{ animation: isFailed || isDelivered ? 'none' : 'spin 2s linear infinite' }} />
                <span style={{ fontSize: '0.9375rem' }}>{isFailed ? 'No agent assigned' : 'Awaiting auto-assignment...'}</span>
              </div>
            )}
          </InfoPanel>

          {/* Pricing */}
          <InfoPanel icon={Package} title="Pricing Details" accentColor="var(--color-accent-500)">
            <Row label="Actual weight" value={`${order.actualWeightKg} kg`} />
            <Row label="Volumetric weight" value={`${order.volumetricWeightKg?.toFixed(2)} kg`} />
            <Row label="Billable weight" value={`${order.billableWeightKg?.toFixed(2)} kg`} />
            <Row label="Base charge" value={`₹${order.baseCharge?.toFixed(2)}`} />
            {order.codSurcharge > 0 && <Row label="COD surcharge" value={`₹${order.codSurcharge?.toFixed(2)}`} />}
            <div style={{ borderTop: '1px solid var(--color-surface-200)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              <Row label="Total charge" value={`₹${order.totalCharge?.toFixed(2)}`} bold />
            </div>
          </InfoPanel>

          {/* Scheduled Date */}
          {order.scheduledDeliveryDate && (
            <InfoPanel icon={CalendarDays} title="Scheduled Delivery" accentColor="var(--color-warning-600)">
              <p style={{ fontWeight: 600, color: 'var(--color-surface-900)', margin: 0, fontSize: '1rem' }}>
                {new Date(order.scheduledDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p style={{ color: 'var(--color-surface-500)', fontSize: '0.8125rem', margin: '0.375rem 0 0' }}>
                {isFailed ? 'Delivery failed — please reschedule' : isRescheduled ? 'Rescheduled — awaiting agent' : 'Expected delivery date'}
              </p>
            </InfoPanel>
          )}

          {/* Failed action CTA */}
          {isFailed && (
            <div style={{
              background: 'var(--color-primary-600)', borderRadius: 'var(--radius-lg)', padding: '1.5rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center',
            }}>
              <RotateCcw size={28} color="rgba(255,255,255,0.9)" />
              <div>
                <p style={{ color: 'white', fontWeight: 700, margin: '0 0 0.25rem', fontSize: '1rem' }}>Reschedule Now</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', margin: 0, lineHeight: 1.5 }}>
                  Choose a new date and our system will automatically find the best available agent.
                </p>
              </div>
              <button
                onClick={() => setShowReschedule(true)}
                style={{
                  background: 'white', color: 'var(--color-primary-600)', border: 'none',
                  borderRadius: 'var(--radius-md)', padding: '0.625rem 1.25rem', fontWeight: 700,
                  cursor: 'pointer', fontSize: '0.9375rem', width: '100%',
                }}
              >
                Pick a New Date
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Address Cards ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <AddressCard title="Pickup" address={order.pickupAddress} type="pickup" />
        <AddressCard title="Drop" address={order.dropAddress} type="drop" />
      </div>
    </div>
  );
};

/* ── Sub-components ──────────────────────────────────────────── */
const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--color-surface-100)' }}>
    <span style={{ color: 'var(--color-surface-500)', fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
    <strong style={{ color: bold ? 'var(--color-surface-900)' : 'var(--color-surface-800)', fontSize: bold ? '1rem' : '0.875rem', fontWeight: bold ? 800 : 600 }}>{value}</strong>
  </div>
);

const InfoPanel = ({ icon: Icon, title, children, accentColor }: any) => (
  <section style={{
    background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)',
    borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-surface-200)' }}>
      <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-md)', background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color={accentColor} />
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-surface-900)', margin: 0 }}>{title}</h3>
    </div>
    {children}
  </section>
);

const AddressCard = ({ title, address, type }: any) => (
  <section style={{
    background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)',
    borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.04, pointerEvents: 'none' }}>
      <MapPin size={80} />
    </div>
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-surface-200)' }}>
        <div style={{
          width: '2rem', height: '2rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: type === 'pickup' ? 'var(--color-primary-50)' : '#F0FDF4',
        }}>
          <MapPin size={15} color={type === 'pickup' ? 'var(--color-primary-600)' : 'var(--color-success-600)'} />
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-surface-900)', margin: 0 }}>{title} Address</h3>
      </div>
      <p style={{ fontWeight: 700, color: 'var(--color-surface-900)', margin: '0 0 0.375rem', fontSize: '1rem' }}>{address?.contactName}</p>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-600)', lineHeight: 1.6, margin: '0 0 0.5rem' }}>
        {address?.line1}{address?.line2 ? `, ${address.line2}` : ''}<br />
        {address?.city}, {address?.state} — {address?.pincode}
      </p>
      {address?.contactPhone && (
        <a href={`tel:${address.contactPhone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-primary-600)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          <Phone size={13} /> {address.contactPhone}
        </a>
      )}
    </div>
  </section>
);
