import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { DataTable } from '../../components/ui/DataTable';

export const NotificationLogPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => apiClient.get('/admin/notifications').then((res: any) => res.data),
  });

  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <Header title="Notification logs" subtitle="Audit email and SMS events generated from status transitions." icon={Bell} />
      <section className="glass-panel p-6 shadow-sm">
        <DataTable columns={[
          { key: 'eventType', header: 'Event' },
          { key: 'channel', header: 'Channel' },
          { key: 'recipient', header: 'Recipient' },
          { key: 'status', header: 'Status', render: (item: any) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'SENT' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-warning-50 text-warning-700 border border-warning-200'}`}>
              {item.status}
            </span>
          )},
          { key: 'createdAt', header: 'Created', render: (item: any) => new Date(item.createdAt).toLocaleString() },
        ]} data={rows} isLoading={isLoading} />
      </section>
    </div>
  );
};

const Header = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-start gap-5 bg-gradient-to-r from-primary-50 to-transparent p-6 rounded-lg border-l-4 border-primary-500 shadow-sm">
    <div className="rounded-xl bg-white p-3 text-primary-600 shadow-sm"><Icon size={28} /></div>
    <div>
      <h1 className="text-3xl font-bold text-surface-950">{title}</h1>
      <p className="mt-2 text-surface-600 text-lg">{subtitle}</p>
    </div>
  </div>
);
