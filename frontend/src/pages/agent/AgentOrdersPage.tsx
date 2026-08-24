import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const AgentOrdersPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['agent-orders'],
    queryFn: () => apiClient.get('/agents/me/orders').then((res: any) => res.data),
    refetchInterval: 15000,
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
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-50 to-transparent p-6 rounded-xl border-l-4 border-l-primary-500 shadow-sm glass-panel">
        <div>
          <h1 className="text-3xl font-bold text-surface-950">Active Route</h1>
          <p className="mt-2 text-surface-600 text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            Live tracking • Last sync {new Date(dataUpdatedAt || Date.now()).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <section className="glass-panel p-6 shadow-sm">
        <DataTable columns={columns} data={orders} isLoading={isLoading} onRowClick={(row: any) => navigate(`/agent/orders/${row.id}`)} />
      </section>
    </div>
  );
};
