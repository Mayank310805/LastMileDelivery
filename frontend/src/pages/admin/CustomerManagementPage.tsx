import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { DataTable } from '../../components/ui/DataTable';

const demoCustomers = [
  { id: 'c1', name: 'Priya', email: 'priya.b2c@example.com', phone: '8888888888', role: 'CUSTOMER', orders: 7 },
  { id: 'c2', name: 'Acme Traders', email: 'acme.traders.b2b@example.com', phone: '7777777777', role: 'CUSTOMER', orders: 3 },
];

export const CustomerManagementPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => apiClient.get('/admin/customers').then((res: any) => res.data),
  });
  const rows = Array.isArray(data) && data.length > 0 ? data : demoCustomers;
  return (
    <div className="space-y-6" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>Customer Management</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Inspect customer accounts and their delivery history.</p>
      </div>
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <DataTable columns={[
          { key: 'name', header: 'Customer' },
          { key: 'email', header: 'Email' },
          { key: 'phone', header: 'Phone' },
          { key: 'orders', header: 'Orders', render: (item: any) => item.orders || '-' },
        ]} data={rows} isLoading={isLoading} />
      </section>
    </div>
  );
};
