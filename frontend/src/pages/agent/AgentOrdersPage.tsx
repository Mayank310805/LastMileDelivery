import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const AgentOrdersPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['agent-orders'],
    queryFn: () => apiClient.get('/agents/me/orders').then((res: any) => res.data),
  });
  
  const orders = Array.isArray(data) ? data : [];
  
  const columns = [
    { key: 'orderNumber', header: 'Order' },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    { key: 'drop', header: 'Drop pincode', render: (item: any) => item.dropAddress?.pincode || '-' },
    { key: 'paymentType', header: 'Payment' },
    { key: 'totalCharge', header: 'Collectable', render: (item: any) => item.paymentType === 'COD' ? `₹${item.totalCharge?.toFixed(2)}` : 'Prepaid' },
  ];

  return (
    <div className="space-y-6 animate-fade-in" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, transparent 100%)', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--color-primary-500)', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>My deliveries</h1>
        <p style={{ color: 'var(--color-surface-600)', fontSize: '1rem' }}>Assigned orders sorted by most recent dispatch.</p>
      </div>
      <section className="glass-panel p-6 shadow-sm">
        <DataTable columns={columns} data={orders} isLoading={isLoading} onRowClick={(row: any) => navigate(`/agent/orders/${row.id}`)} />
      </section>
    </div>
  );
};
