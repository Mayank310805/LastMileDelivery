import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, ClipboardList, MapPin, Navigation, PackageCheck, Truck, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { KPICard } from '../../components/ui/KPICard';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const AgentDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['agent-orders'],
    queryFn: () => apiClient.get('/agents/me/orders').then((res: any) => res.data),
  });
  
  const orders = Array.isArray(data) ? data : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <section className="glass-panel" style={{ background: 'linear-gradient(to right, var(--color-primary-50), transparent)', borderLeft: '4px solid var(--color-primary-500)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', ...(window.innerWidth >= 1024 ? { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } : {}) }}>
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-primary-600)', letterSpacing: '0.05em' }}>Agent route board</p>
            <h1 style={{ marginTop: '0.5rem', fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>Today's delivery queue</h1>
            <p style={{ marginTop: '0.75rem', fontSize: '1.125rem', color: 'var(--color-surface-600)' }}>Update each stop as it moves from assigned to delivered or failed.</p>
          </div>
          <Button onClick={() => navigate('/agent/orders')} className="btn-primary" style={{ boxShadow: 'var(--shadow-lg)', color: 'white' }}>
            <Navigation size={18} />
            Open queue
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-4">
        <KPICard title="Assigned" value={isLoading ? '-' : orders.length} icon={ClipboardList} />
        <KPICard title="In transit" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'IN_TRANSIT').length} icon={MapPin} />
        <KPICard title="Out for delivery" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'OUT_FOR_DELIVERY').length} icon={Truck} color="warning" />
        <KPICard title="Delivered" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'DELIVERED').length} icon={CheckCircle} color="success" />
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {isLoading ? (
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <Loader2 className="animate-spin" size={32} color="var(--color-primary-500)" />
          </div>
        ) : orders.slice(0, 6).map((order: any) => (
          <button key={order.id} onClick={() => navigate(`/agent/orders/${order.id}`)} className="glass-panel" style={{ textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', border: 'none' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '0.75rem' }}>
              <div style={{ borderRadius: '50%', background: 'var(--color-primary-50)', padding: '0.5rem', color: 'var(--color-primary-600)', boxShadow: 'var(--shadow-sm)' }}>
                <PackageCheck size={20} />
              </div>
              <StatusBadge status={order.status} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>{order.orderNumber}</h2>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-surface-600)' }}>{order.pickupAddress?.line1} to {order.dropAddress?.line1}</p>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-surface-400)' }}>PIN: {order.dropAddress?.pincode}</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-600)' }}>₹{order.totalCharge?.toFixed(2)}</p>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};
