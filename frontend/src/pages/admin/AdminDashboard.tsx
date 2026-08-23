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
      <section className="glass-panel" style={{ background: 'linear-gradient(to bottom right, var(--color-primary-50), white)', marginBottom: '1.5rem' }}>
        <div className="flex flex-col lg-flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--color-primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin command center</p>
            <h1 className="text-4xl font-bold mt-2">Monitor pricing, dispatch, exceptions, and configuration.</h1>
            <p className="text-lg mt-3" style={{ color: 'var(--color-surface-600)', maxWidth: '48rem' }}>This workspace exposes the full project brief: zone management, rate cards, COD surcharge controls, assignment, override, and audit visibility.</p>
          </div>
          <Button onClick={() => assignAll.mutate()} isLoading={assignAll.isPending} className="btn-primary" style={{ whiteSpace: 'nowrap', boxShadow: 'var(--shadow-xl)' }}>
            <RadioTower size={20} />
            Auto-assign pending
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard title="Total orders" value={isLoadingKpi ? '-' : kpis.totalOrders} icon={Boxes} />
        <KPICard title="Unassigned" value={isLoadingKpi ? '-' : kpis.unassignedCount} icon={AlertCircle} color="warning" />
        <KPICard title="Active agents" value={isLoadingKpi ? '-' : kpis.activeAgents} icon={Truck} color="success" />
        <KPICard title="Failed deliveries" value={isLoadingKpi ? '-' : kpis.failedCount} icon={AlertCircle} color="danger" />
      </div>

      <section className="panel animate-fade-in">
        <div className="flex items-center justify-between mb-6" style={{ borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
          <div>
            <h2 className="text-xl font-bold">Operations queue</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-surface-500)' }}>Newest orders with assignment and revenue context.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/orders')}>All orders</Button>
        </div>
        {isLoadingOrders ? (
          <div className="flex justify-center items-center" style={{ height: '16rem' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--color-primary-500)', borderBottomColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <DataTable columns={columns} data={orders.slice(0, 5)} onRowClick={(row: any) => navigate(`/admin/orders/${row.id}`)} />
        )}
      </section>
    </div>
  );
};
