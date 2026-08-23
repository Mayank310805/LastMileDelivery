import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => apiClient.get('/admin/orders').then((res: any) => res.data),
  });
  
  const orders = Array.isArray(data) ? data : [];
  
  const columns = [
    { key: 'orderNumber', header: 'Order' },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    { key: 'customerId', header: 'Customer', render: (item: any) => item.customer?.name || item.customerId || 'Seed customer' },
    { key: 'agent', header: 'Agent', render: (item: any) => item.currentAgent?.user?.name || 'Unassigned' },
    { key: 'route', header: 'Route', render: (item: any) => `${item.pickupAddress?.pincode || '-'} -> ${item.dropAddress?.pincode || '-'}` },
    { key: 'totalCharge', header: 'Charge', render: (item: any) => `₹${item.totalCharge.toFixed(2)}` },
  ];

  return (
    <div className="space-y-6 animate-fade-in" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, transparent 100%)', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--color-primary-500)', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>All orders</h1>
        <p style={{ color: 'var(--color-surface-600)', fontSize: '1rem' }}>Audit every delivery, assignment, customer, and exception.</p>
      </div>
      <section className="glass-panel p-6 shadow-sm">
        <DataTable columns={columns} data={orders} isLoading={isLoading} onRowClick={(row: any) => navigate(`/admin/orders/${row.id}`)} />
      </section>
    </div>
  );
};
