import { useQuery } from '@tanstack/react-query';
import { Contact } from 'lucide-react';
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
    <div className="space-y-6">
      <Header title="Customer management" subtitle="Inspect customer accounts and their delivery history." icon={Contact} />
      <section className="panel rounded-lg p-5">
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

const Header = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-start gap-4">
    <div className="rounded-lg bg-primary-50 p-3 text-primary-700"><Icon size={24} /></div>
    <div><h1 className="text-3xl font-bold text-surface-950">{title}</h1><p className="mt-2 text-surface-500">{subtitle}</p></div>
  </div>
);
