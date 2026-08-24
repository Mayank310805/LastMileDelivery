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
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>All Orders</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Audit every delivery, assignment, customer, and exception.</p>
      </div>
      <section className="glass-panel">
        <DataTable columns={columns} data={orders} isLoading={isLoading} onRowClick={(row: any) => navigate(`/admin/orders/${row.id}`)} />
      </section>
    </div>
  );
};
