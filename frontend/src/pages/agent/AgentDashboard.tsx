import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, ClipboardList, MapPin, Navigation, PackageCheck, Truck, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { KPICard } from '../../components/ui/KPICard';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['agent-orders'],
    queryFn: () => apiClient.get('/agents/me/orders').then((res: any) => res.data),
    refetchInterval: 15000,
  });
  
  const orders = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <section className="glass-panel border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50 to-transparent">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-6">
          <div>
            <p className="text-sm font-semibold uppercase text-primary-600 tracking-wider">Agent route board</p>
            <h1 className="mt-2 text-3xl font-bold text-surface-950">
              Good morning, {user?.name || 'Agent'}
            </h1>
            <p className="mt-2 text-surface-600 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              Live sync active • Last updated {new Date(dataUpdatedAt || Date.now()).toLocaleTimeString()}
            </p>
          </div>
          <Button onClick={() => navigate('/agent/orders')} className="btn-primary shadow-lg text-white w-full lg:w-auto mt-4 lg:mt-0">
            <Navigation size={18} />
            Open queue
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Assigned" value={isLoading ? '-' : orders.length} icon={ClipboardList} />
        <KPICard title="In transit" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'IN_TRANSIT').length} icon={MapPin} />
        <KPICard title="Out for delivery" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'OUT_FOR_DELIVERY').length} icon={Truck} color="warning" />
        <KPICard title="Delivered" value={isLoading ? '-' : orders.filter((o: any) => o.status === 'DELIVERED').length} icon={CheckCircle} color="success" />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : orders.slice(0, 6).map((order: any) => (
          <button 
            key={order.id} 
            onClick={() => navigate(`/agent/orders/${order.id}`)} 
            className="glass-panel text-left cursor-pointer transition-all duration-200 border-none p-5 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <div className="mb-4 flex items-center justify-between border-b border-surface-200 pb-3">
              <div className="rounded-full bg-primary-50 p-2 text-primary-600 shadow-sm">
                <PackageCheck size={20} />
              </div>
              <StatusBadge status={order.status} />
            </div>
            <h2 className="text-xl font-bold text-surface-950">{order.orderNumber}</h2>
            <p className="mt-2 text-sm text-surface-600 truncate">
              {order.pickupAddress?.line1} to {order.dropAddress?.line1}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs font-bold tracking-wider uppercase text-surface-400">PIN: {order.dropAddress?.pincode}</p>
              <p className="text-sm font-semibold text-primary-600">₹{order.totalCharge?.toFixed(2)}</p>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

