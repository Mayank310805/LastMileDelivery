import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle, Clock3, Package, PlusCircle, RotateCcw, Truck, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { KPICard } from '../../components/ui/KPICard';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => apiClient.get('/orders').then((res: any) => res.data),
  });
  
  const orders = Array.isArray(data) ? data : [];
  const active = orders.filter((order: any) => !['DELIVERED', 'FAILED'].includes(order.status)).length;

  const columns = [
    { key: 'orderNumber', header: 'Order' },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    { key: 'route', header: 'Route', render: (item: any) => `${item.pickupAddress?.pincode || '-'} -> ${item.dropAddress?.pincode || '-'}` },
    { key: 'totalCharge', header: 'Charge', render: (item: any) => `₹${item.totalCharge?.toFixed(2)}` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <section style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem', backgroundColor: 'var(--color-surface-950)', color: 'white', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(19,78,74,0.4), var(--color-surface-950), var(--color-surface-900))' }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', padding: '2rem' }} className="lg-grid-cols-layout">
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary-400)' }}>Customer control room</p>
            <h1 style={{ marginTop: '1rem', maxWidth: '42rem', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.025em' }}>Create, price, track, and recover deliveries from one clean workspace.</h1>
            <p style={{ marginTop: '1rem', maxWidth: '42rem', fontSize: '1.125rem', color: 'var(--color-surface-300)', lineHeight: 1.6 }}>The lifecycle covers quote, confirmation, auto-assignment, status notifications, failure reason capture, and rescheduling.</p>
            <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Button onClick={() => navigate('/orders/new')} className="btn-primary" style={{ boxShadow: '0 10px 15px -3px rgba(20,184,166,0.3)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <PlusCircle size={20} />
                New order
              </Button>
              <Button variant="outline" onClick={() => navigate('/orders')} style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', backdropFilter: 'blur(4px)' }}>
                View all
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
          <div style={{ borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', backdropFilter: 'blur(12px)', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div style={{ borderRadius: '9999px', background: 'rgba(20,184,166,0.2)', padding: '0.5rem', color: 'var(--color-primary-400)' }}>
                <Truck size={20} />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Live sample route</span>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {['Created', 'Assigned', 'In transit', 'Out for delivery'].map((step, index) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ display: 'flex', height: '2rem', width: '2rem', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)', background: index === 0 ? 'var(--color-primary-500)' : 'var(--color-surface-800)', color: index === 0 ? 'white' : 'var(--color-surface-400)', outline: index === 0 ? '4px solid rgba(20,184,166,0.2)' : 'none' }}>{index + 1}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: index === 0 ? 'white' : 'var(--color-surface-400)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-4">
        <KPICard title="Total orders" value={isLoading ? '-' : orders.length} icon={Package} />
        <KPICard title="Active" value={isLoading ? '-' : active} icon={Clock3} color="warning" />
        <KPICard title="Delivered" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'DELIVERED').length} icon={CheckCircle} color="success" />
        <KPICard title="Needs action" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'FAILED').length} icon={RotateCcw} color="danger" />
      </div>

      <section className="glass-panel" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>Recent orders</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Click an order to inspect route, agent, pricing, and timeline.</p>
          </div>
        </div>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <Loader2 className="animate-spin" size={32} color="var(--color-primary-500)" />
          </div>
        ) : (
          <DataTable columns={columns} data={orders.slice(0, 6)} isLoading={isLoading} onRowClick={(row: any) => navigate(`/orders/${row.id}`)} />
        )}
      </section>
    </div>
  );
};
