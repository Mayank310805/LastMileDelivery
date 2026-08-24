import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle, Clock3, Package, RotateCcw, Loader2,
  AlertTriangle, ArrowRight, Truck, PackagePlus, CalendarDays,
  ChevronRight, RefreshCw
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { KPICard } from '../../components/ui/KPICard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

const statusLabel = (status: string) =>
  status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, m => m.toUpperCase());

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => apiClient.get('/orders').then((res: any) => res.data),
    refetchInterval: 30000, // live update every 30s
  });

  const orders: any[] = Array.isArray(data) ? data : [];
  const failedOrders = orders.filter((o: any) => o.status === 'FAILED');
  const rescheduledOrders = orders.filter((o: any) => o.status === 'RESCHEDULED');
  const activeOrders = orders.filter((o: any) => !['DELIVERED', 'FAILED', 'RESCHEDULED'].includes(o.status));
  const deliveredOrders = orders.filter((o: any) => o.status === 'DELIVERED');
  const inTransitOrders = orders.filter((o: any) => ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PICKED_UP'].includes(o.status));

  const columns = [
    {
      key: 'orderNumber', header: 'Order #',
      render: (item: any) => (
        <span style={{ fontWeight: 700, color: 'var(--color-primary-600)', fontSize: '0.9375rem' }}>{item.orderNumber}</span>
      )
    },
    {
      key: 'status', header: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />
    },
    {
      key: 'route', header: 'Route',
      render: (item: any) => (
        <span style={{ fontSize: '0.875rem', color: 'var(--color-surface-600)' }}>
          {item.pickupAddress?.city || '—'} → {item.dropAddress?.city || '—'}
        </span>
      )
    },
    {
      key: 'totalCharge', header: 'Amount',
      render: (item: any) => <span style={{ fontWeight: 600 }}>₹{item.totalCharge?.toFixed(2)}</span>
    },
    {
      key: 'action', header: '',
      render: () => <ChevronRight size={16} color="var(--color-surface-400)" />
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.4s ease' }}>

      {/* ── Greeting ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-surface-900)', margin: '0 0 0.375rem' }}>
            {getTimeOfDay()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p style={{ color: 'var(--color-surface-500)', fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <RefreshCw size={13} />
            Live — last updated {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={() => navigate('/orders/new')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--color-primary-600)', color: 'white', border: 'none',
            borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem',
            fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
          }}
        >
          <PackagePlus size={18} /> New Order
        </button>
      </div>

      {/* ── Failed Orders Alert Banner ──────────────────────── */}
      {failedOrders.length > 0 && (
        <div style={{
          background: 'var(--color-danger-50)', border: '1px solid var(--color-danger-200)',
          borderLeft: '4px solid var(--color-danger-500)', borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
              <AlertTriangle size={22} color="var(--color-danger-500)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
              <div>
                <h3 style={{ fontWeight: 700, color: 'var(--color-danger-700)', margin: '0 0 0.375rem', fontSize: '1.0625rem' }}>
                  {failedOrders.length} Delivery Attempt{failedOrders.length > 1 ? 's' : ''} Failed
                </h3>
                <p style={{ color: 'var(--color-danger-600)', margin: 0, fontSize: '0.9375rem', lineHeight: 1.5 }}>
                  {failedOrders.length === 1
                    ? `Order ${failedOrders[0].orderNumber} needs your attention. Please reschedule to retry delivery.`
                    : `${failedOrders.length} orders need your attention. Please reschedule each to retry delivery.`
                  }
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
              {failedOrders.map((o: any) => (
                <button
                  key={o.id}
                  onClick={() => navigate(`/orders/${o.id}`)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--color-danger-500)', color: 'white', border: 'none',
                    borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem',
                    fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <RotateCcw size={14} /> Reschedule {o.orderNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Rescheduled Pending Banner ──────────────────────── */}
      {rescheduledOrders.length > 0 && (
        <div style={{
          background: 'var(--color-warning-50)', border: '1px solid var(--color-warning-100)',
          borderLeft: '4px solid var(--color-warning-500)', borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem',
        }}>
          <CalendarDays size={20} color="var(--color-warning-600)" style={{ flexShrink: 0 }} />
          <p style={{ color: 'var(--color-warning-700)', margin: 0, fontSize: '0.9375rem', fontWeight: 500 }}>
            <strong>{rescheduledOrders.length} order{rescheduledOrders.length > 1 ? 's' : ''}</strong> rescheduled and awaiting agent assignment.
          </p>
        </div>
      )}

      {/* ── In-Transit Live Orders ──────────────────────────── */}
      {inTransitOrders.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
          borderRadius: 'var(--radius-xl)', padding: '1.5rem', color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <Truck size={20} color="rgba(255,255,255,0.9)" />
            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0, color: 'white' }}>
              {inTransitOrders.length === 1 ? 'Your package is on its way!' : `${inTransitOrders.length} packages in transit`}
            </h2>
            <span style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 'var(--radius-full)', padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '0.375rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
              LIVE
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {inTransitOrders.map((o: any) => (
              <button
                key={o.id}
                onClick={() => navigate(`/orders/${o.id}`)}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', color: 'white', width: '100%', textAlign: 'left',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              >
                <div>
                  <p style={{ fontWeight: 700, margin: '0 0 0.25rem', fontSize: '0.9375rem' }}>{o.orderNumber}</p>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>
                    {statusLabel(o.status)} · {o.pickupAddress?.city} → {o.dropAddress?.city}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Track</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
        <KPICard title="Total Orders" value={isLoading ? '-' : orders.length} icon={Package} />
        <KPICard title="Active" value={isLoading ? '-' : activeOrders.length} icon={Clock3} color="warning" />
        <KPICard title="Delivered" value={isLoading ? '-' : deliveredOrders.length} icon={CheckCircle} color="success" />
        <KPICard title="Needs Action" value={isLoading ? '-' : failedOrders.length} icon={RotateCcw} color="danger" />
      </div>

      {/* ── Recent Orders Table ─────────────────────────────── */}
      <section style={{
        background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)',
        borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-surface-200)' }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-surface-900)', margin: '0 0 0.25rem' }}>Recent Orders</h2>
            <p style={{ color: 'var(--color-surface-500)', fontSize: '0.875rem', margin: 0 }}>Click any order to view live tracking and full timeline.</p>
          </div>
          <button
            onClick={() => navigate('/orders')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              color: 'var(--color-primary-600)', background: 'none', border: 'none',
              fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem', gap: '0.75rem', color: 'var(--color-surface-500)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} color="var(--color-primary-500)" />
            <span style={{ fontWeight: 500 }}>Loading your orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-surface-500)' }}>
            <Package size={48} color="var(--color-surface-300)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600, fontSize: '1.0625rem', margin: '0 0 0.5rem', color: 'var(--color-surface-700)' }}>No orders yet</p>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.9375rem' }}>Create your first delivery order to get started.</p>
            <button
              onClick={() => navigate('/orders/new')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--color-primary-600)', color: 'white', border: 'none',
                borderRadius: 'var(--radius-md)', padding: '0.75rem 1.5rem',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem',
              }}
            >
              <PackagePlus size={18} /> Create First Order
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col.key} style={{
                      textAlign: 'left', padding: '0.625rem 0.875rem', fontSize: '0.75rem',
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: 'var(--color-surface-500)', background: 'var(--color-surface-50)',
                      borderBottom: '1px solid var(--color-surface-200)',
                    }}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order: any) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    style={{ cursor: 'pointer' }}
                    onMouseOver={e => (e.currentTarget.style.background = 'var(--color-primary-50)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {columns.map(col => (
                      <td key={col.key} style={{
                        padding: '0.875rem', borderBottom: '1px solid var(--color-surface-100)',
                        fontSize: '0.875rem', color: 'var(--color-surface-700)',
                      }}>
                        {col.render ? col.render(order) : (order as any)[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
