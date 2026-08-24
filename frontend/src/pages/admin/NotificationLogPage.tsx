import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { DataTable } from '../../components/ui/DataTable';

export const NotificationLogPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => apiClient.get('/admin/notifications').then((res: any) => res.data),
  });

  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-fade-in" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>Notification Logs</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Audit email and SMS events generated from status transitions.</p>
      </div>
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <DataTable columns={[
          { key: 'eventType', header: 'Event' },
          { key: 'channel', header: 'Channel' },
          { key: 'recipient', header: 'Recipient' },
          { key: 'status', header: 'Status', render: (item: any) => (
            <span className={`badge ${item.status === 'SENT' ? 'badge-success' : 'badge-warning'}`}>
              {item.status}
            </span>
          )},
          { key: 'createdAt', header: 'Created', render: (item: any) => new Date(item.createdAt).toLocaleString() },
        ]} data={rows} isLoading={isLoading} />
      </section>
    </div>
  );
};
