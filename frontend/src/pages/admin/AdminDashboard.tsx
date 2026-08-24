import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AlertCircle, Boxes, RadioTower, Truck } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { KPICard } from '../../components/ui/KPICard';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: dashboardData, isLoading: isLoadingKpi } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiClient.get('/admin/dashboard').then((res: any) => res.data),
  });

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => apiClient.get('/admin/orders').then((res: any) => res.data),
  });
  
  const orders = Array.isArray(ordersData) ? ordersData : [];
  const kpis = dashboardData || { totalOrders: 0, unassignedCount: 0, activeAgents: 0, failedCount: 0 };

  const assignAll = useMutation({
    mutationFn: () => apiClient.post('/admin/orders/auto-assign-all'),
    onSuccess: () => {
      toast.success('Auto-assignment pass completed');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Auto-assignment failed'),
  });

  const columns = [
    { key: 'orderNumber', header: 'Order' },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    { key: 'agent', header: 'Agent', render: (item: any) => item.currentAgent?.user?.name || 'Unassigned' },
    { key: 'totalCharge', header: 'Revenue', render: (item: any) => `₹${item.totalCharge.toFixed(2)}` },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>Operations Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Monitor pricing, dispatch, exceptions, and configuration.</p>
        </div>
        <Button onClick={() => assignAll.mutate()} isLoading={assignAll.isPending} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          <RadioTower size={16} style={{ marginRight: '0.5rem' }} />
          Auto-assign pending
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard title="Total orders" value={isLoadingKpi ? '-' : kpis.totalOrders} icon={Boxes} />
        <KPICard title="Unassigned" value={isLoadingKpi ? '-' : kpis.unassignedCount} icon={AlertCircle} color="warning" />
        <KPICard title="Active agents" value={isLoadingKpi ? '-' : kpis.activeAgents} icon={Truck} color="success" />
        <KPICard title="Failed deliveries" value={isLoadingKpi ? '-' : kpis.failedCount} icon={AlertCircle} color="danger" />
      </div>

      <section className="glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-surface-900)' }}>Operations queue</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-surface-500)' }}>Newest orders with assignment and revenue context.</p>
          </div>
          <Button variant="outline" className="btn btn-outline" onClick={() => navigate('/admin/orders')}>All orders</Button>
        </div>
        {isLoadingOrders ? (
          <div className="flex justify-center items-center" style={{ height: '16rem' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--color-primary-600)', borderBottomColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <DataTable columns={columns} data={orders.slice(0, 5)} onRowClick={(row: any) => navigate(`/admin/orders/${row.id}`)} />
        )}
      </section>
    </div>
  );
};
