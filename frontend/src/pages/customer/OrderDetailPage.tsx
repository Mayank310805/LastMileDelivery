import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarClock, MapPin, Package, RotateCcw, UserRound, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';

export const statusLabel = (status?: string) => (status || 'CREATED').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (m: string) => m.toUpperCase());

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiClient.get(`/orders/${id}`).then((res: any) => res.data),
    enabled: Boolean(id),
  });
  
  const { data: apiTracking } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => apiClient.get(`/orders/${id}/tracking`).then((res: any) => res.data),
    enabled: Boolean(id),
  });

  const tracking = Array.isArray(apiTracking) ? apiTracking : [];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '16rem', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary-500)" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-surface-900)' }}>Order not found</h2>
        <Button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div className="glass-panel" style={{ background: 'linear-gradient(to right, rgba(204, 251, 241, 0.5), transparent)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', ...(window.innerWidth >= 1024 ? { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } : {}) }}>
          <div>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-500)', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-surface-900)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-surface-500)'}>
              <ArrowLeft size={16} />
              Back
            </button>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p style={{ marginTop: '0.75rem', color: 'var(--color-surface-600)', fontWeight: 500 }}>{order.orderType} shipment - {order.paymentType} - ₹{order.totalCharge?.toFixed(2)}</p>
          </div>
          {order.status === 'FAILED' && (
            <Button onClick={() => navigate(`/orders/${id}/reschedule`)} className="btn-primary" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <RotateCcw size={18} />
              Reschedule delivery
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr' }}>
        <section className="glass-panel" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-surface-950)', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '0.75rem' }}>Tracking timeline</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tracking.map((item: any, index: number) => (
              <div key={item.id || index} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ display: 'flex', height: '2.5rem', width: '2.5rem', borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-800)', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}>{index + 1}</span>
                  {index < tracking.length - 1 && <span style={{ marginTop: '0.5rem', height: '100%', width: '2px', background: 'var(--color-surface-200)' }} />}
                </div>
                <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-surface-200)', background: 'rgba(255, 255, 255, 0.6)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid var(--color-surface-100)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--color-surface-950)', fontSize: '1.125rem' }}>{statusLabel(item.newStatus || item.status)}</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-surface-500)', background: 'var(--color-surface-100)', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-surface-600)', fontWeight: 500 }}>{item.remarks || 'Status updated'}</p>
                  <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-primary-600)' }}>{item.actorRole || 'SYSTEM'}</p>
                </div>
              </div>
            ))}
            {tracking.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--color-surface-500)', fontWeight: 500 }}>No tracking events recorded yet.</div>
            )}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <InfoPanel icon={Package} title="Pricing">
            <Row label="Billable weight" value={`${order.billableWeightKg || 0} kg`} />
            <Row label="Total charge" value={`₹${order.totalCharge?.toFixed(2)}`} />
          </InfoPanel>
          <InfoPanel icon={UserRound} title="Assigned agent">
            <p style={{ fontWeight: 600, color: 'var(--color-surface-950)', fontSize: '1.125rem' }}>{order.currentAgent?.user?.name || 'Pending assignment'}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', fontWeight: 500, marginTop: '0.25rem' }}>{order.currentAgent?.user?.phone || 'Auto-assignment will retry'}</p>
          </InfoPanel>
          <InfoPanel icon={CalendarClock} title="Delivery window">
            <p style={{ fontWeight: 600, color: 'var(--color-surface-950)', fontSize: '1.125rem' }}>Today, 2 PM - 7 PM</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', fontWeight: 500, marginTop: '0.25rem' }}>{order.status === 'FAILED' ? 'Needs customer action' : 'On active route'}</p>
          </InfoPanel>
        </aside>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr' }}>
        <AddressCard title="Pickup" address={order.pickupAddress} />
        <AddressCard title="Drop" address={order.dropAddress} />
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-surface-100)' }}>
    <span style={{ color: 'var(--color-surface-500)', fontWeight: 500 }}>{label}</span>
    <strong style={{ color: 'var(--color-surface-950)' }}>{value}</strong>
  </div>
);

const InfoPanel = ({ icon: Icon, title, children }: any) => (
  <section className="glass-panel" style={{ boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
    <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '0.75rem' }}>
      <div style={{ borderRadius: '50%', background: 'var(--color-primary-50)', padding: '0.5rem', color: 'var(--color-primary-600)', boxShadow: 'var(--shadow-sm)' }}>
        <Icon size={20} />
      </div>
      <h2 style={{ fontWeight: 'bold', color: 'var(--color-surface-950)', fontSize: '1.125rem' }}>{title}</h2>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>{children}</div>
  </section>
);

const AddressCard = ({ title, address }: any) => (
  <section className="glass-panel" style={{ position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
    <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.05 }}>
      <MapPin size={100} />
    </div>
    <div style={{ position: 'relative', zIndex: 10 }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '0.75rem', width: 'fit-content' }}>
        <div style={{ borderRadius: '50%', background: 'var(--color-primary-50)', padding: '0.5rem', color: 'var(--color-primary-600)', boxShadow: 'var(--shadow-sm)' }}>
          <MapPin size={20} />
        </div>
        <h2 style={{ fontWeight: 'bold', color: 'var(--color-surface-950)', fontSize: '1.125rem' }}>{title} address</h2>
      </div>
      <p style={{ fontWeight: 'bold', color: 'var(--color-surface-950)', fontSize: '1.125rem' }}>{address?.contactName}</p>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-600)', fontWeight: 500, marginTop: '0.5rem', lineHeight: 1.6 }}>{address?.line1}, <br/>{address?.city}, {address?.state} - {address?.pincode}</p>
      <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-600)', letterSpacing: '0.025em' }}>{address?.contactPhone}</p>
    </div>
  </section>
);
