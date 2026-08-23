import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Filter, PackagePlus } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';

export const OrderListPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/orders').then((res: any) => res.data),
  });
  
  const orders = Array.isArray(data) ? data : [];

  const columns = [
    { key: 'orderNumber', header: 'Order' },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    { key: 'orderType', header: 'Type' },
    { key: 'paymentType', header: 'Payment' },
    { key: 'route', header: 'Route', render: (item: any) => `${item.pickupAddress?.city || '-'} -> ${item.dropAddress?.city || '-'}` },
    { key: 'totalCharge', header: 'Charge', render: (item: any) => `₹${item.totalCharge?.toFixed(2)}` },
    { key: 'createdAt', header: 'Created', render: (item: any) => new Date(item.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-primary-50 to-transparent p-6 rounded-lg border-l-4 border-primary-500 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-surface-950">My orders</h1>
          <p className="mt-2 text-surface-600 text-lg">All deliveries with pricing, status, and reschedule context.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="shadow-sm">
            <Filter size={18} />
            Filters
          </Button>
          <Button onClick={() => navigate('/orders/new')} className="shadow-lg shadow-primary-500/20">
            <PackagePlus size={18} />
            Create
          </Button>
        </div>
      </div>
      <section className="glass-panel p-6 shadow-sm">
        <DataTable columns={columns} data={orders} isLoading={isLoading} onRowClick={(row: any) => navigate(`/orders/${row.id}`)} />
      </section>
    </div>
  );
};
