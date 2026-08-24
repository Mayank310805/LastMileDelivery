import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock3, Package, RotateCcw, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { KPICard } from '../../components/ui/KPICard';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => apiClient.get('/orders').then((res: any) => res.data),
  });
  
  const orders = Array.isArray(data) ? data : [];
  const active = orders.filter((order: any) => !['DELIVERED', 'FAILED'].includes(order.status)).length;

  const columns = [
    { key: 'orderNumber', header: 'Order' },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    { key: 'route', header: 'Route', render: (item: any) => `${item.pickupAddress?.pincode || '-'} -> ${item.dropAddress?.pincode || '-'}` },
    { key: 'totalCharge', header: 'Charge', render: (item: any) => `₹${item.totalCharge?.toFixed(2)}` },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-surface-900">Good morning, {user?.name || 'Customer'}</h1>
        <p className="text-surface-600 text-lg">Here's what's happening with your deliveries.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total orders" value={isLoading ? '-' : orders.length} icon={Package} />
        <KPICard title="Active" value={isLoading ? '-' : active} icon={Clock3} color="warning" />
        <KPICard title="Delivered" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'DELIVERED').length} icon={CheckCircle} color="success" />
        <KPICard title="Needs action" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'FAILED').length} icon={RotateCcw} color="danger" />
      </div>

      <section className="glass-panel p-6 shadow-sm rounded-xl">
        <div className="mb-6 flex items-center justify-between border-b border-surface-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-surface-900">Recent orders</h2>
            <p className="text-sm text-surface-500 mt-1">Click an order to inspect route, agent, pricing, and timeline.</p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : (
          <DataTable columns={columns} data={orders.slice(0, 6)} isLoading={isLoading} onRowClick={(row: any) => navigate(`/orders/${row.id}`)} />
        )}
      </section>
    </div>
  );
};
