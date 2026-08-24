import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  PackagePlus, Search, ChevronRight, AlertTriangle,
  CheckCircle2, Clock, Truck, RotateCcw, Package, Loader2
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';

const STATUS_FILTERS = [
  { key: 'ALL',              label: 'All',            icon: Package },
  { key: 'ACTIVE',          label: 'Active',          icon: Clock },
  { key: 'IN_TRANSIT',      label: 'In Transit',      icon: Truck },
  { key: 'DELIVERED',       label: 'Delivered',       icon: CheckCircle2 },
  { key: 'FAILED',          label: 'Failed',          icon: AlertTriangle },
  { key: 'RESCHEDULED',     label: 'Rescheduled',     icon: RotateCcw },
];

const ACTIVE_STATUSES = ['CREATED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'RESCHEDULED'];

export const OrderListPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/orders').then((res: any) => res.data),
    refetchInterval: 30000,
  });

  const orders: any[] = Array.isArray(data) ? data : [];

  const filtered = orders.filter((o: any) => {
    const matchFilter =
      activeFilter === 'ALL' ? true :
      activeFilter === 'ACTIVE' ? ACTIVE_STATUSES.includes(o.status) :
      o.status === activeFilter;

    const matchSearch = search === '' ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.pickupAddress?.city?.toLowerCase().includes(search.toLowerCase()) ||
      o.dropAddress?.city?.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const failedCount = orders.filter((o: any) => o.status === 'FAILED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.4s ease' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-surface-900)', margin: '0 0 0.25rem' }}>
            My Orders
          </h1>
          <p style={{ color: 'var(--color-surface-500)', fontSize: '1rem', margin: 0 }}>
            {isLoading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
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

      {/* ── Failed Alert ────────────────────────────────────── */}
      {failedCount > 0 && (
        <div
          onClick={() => setActiveFilter('FAILED')}
          style={{
            background: 'var(--color-danger-50)', border: '1px solid var(--color-danger-200)',
            borderLeft: '4px solid var(--color-danger-500)', borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <AlertTriangle size={20} color="var(--color-danger-500)" style={{ flexShrink: 0 }} />
          <p style={{ color: 'var(--color-danger-700)', margin: 0, fontWeight: 600, fontSize: '0.9375rem', flex: 1 }}>
            {failedCount} order{failedCount > 1 ? 's' : ''} failed delivery — click to view and reschedule
          </p>
          <ChevronRight size={18} color="var(--color-danger-500)" />
        </div>
      )}

      {/* ── Search & Filter ─────────────────────────────────── */}
      <div style={{
        background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)',
        borderRadius: 'var(--radius-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--color-surface-400)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by order number or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem',
              border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)',
              fontSize: '0.9375rem', background: 'var(--color-surface-50)',
              color: 'var(--color-surface-900)', boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => {
            const isActive = activeFilter === f.key;
            const count = f.key === 'ALL' ? orders.length
              : f.key === 'ACTIVE' ? orders.filter((o: any) => ACTIVE_STATUSES.includes(o.status)).length
              : orders.filter((o: any) => o.status === f.key).length;
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.45rem 0.875rem', borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isActive ? 'var(--color-primary-600)' : 'var(--color-surface-200)'}`,
                  background: isActive ? 'var(--color-primary-600)' : 'var(--color-bg-white)',
                  color: isActive ? 'white' : 'var(--color-surface-600)',
                  fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={13} />
                {f.label}
                {count > 0 && (
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-100)',
                    borderRadius: 'var(--radius-full)', padding: '0.05rem 0.45rem',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Orders Table ───────────────────────────────────── */}
      <div style={{
        background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem', gap: '0.75rem', color: 'var(--color-surface-500)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} color="var(--color-primary-500)" />
            <span style={{ fontWeight: 500 }}>Loading orders...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Package size={48} color="var(--color-surface-300)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--color-surface-700)', margin: '0 0 0.5rem' }}>
              {search || activeFilter !== 'ALL' ? 'No matching orders' : 'No orders yet'}
            </p>
            <p style={{ color: 'var(--color-surface-500)', fontSize: '0.9375rem', margin: 0 }}>
              {search ? 'Try a different search term.' : activeFilter !== 'ALL' ? 'Try a different filter.' : 'Create your first order to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {['Order #', 'Status', 'Route', 'Type', 'Payment', 'Amount', 'Date', ''].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.6875rem',
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: 'var(--color-surface-500)', background: 'var(--color-surface-50)',
                      borderBottom: '1px solid var(--color-surface-200)', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order: any) => {
                  const isFailed = order.status === 'FAILED';
                  return (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{
                        cursor: 'pointer',
                        background: isFailed ? 'rgba(254,242,242,0.5)' : 'transparent',
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = isFailed ? '#FEE2E2' : 'var(--color-primary-50)')}
                      onMouseOut={e => (e.currentTarget.style.background = isFailed ? 'rgba(254,242,242,0.5)' : 'transparent')}
                    >
                      <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-surface-100)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isFailed && <AlertTriangle size={14} color="var(--color-danger-500)" />}
                          <span style={{ fontWeight: 700, color: 'var(--color-primary-600)', fontSize: '0.9375rem' }}>{order.orderNumber}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-surface-100)' }}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-surface-100)' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-surface-700)' }}>
                          {order.pickupAddress?.city || '—'} → {order.dropAddress?.city || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-surface-100)' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--color-surface-600)' }}>{order.orderType}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-surface-100)' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--color-surface-600)' }}>{order.paymentType}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-surface-100)' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-surface-900)' }}>₹{order.totalCharge?.toFixed(2)}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-surface-100)' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--color-surface-500)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-surface-100)' }}>
                        <ChevronRight size={16} color="var(--color-surface-400)" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
