import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarClock, MapPin, Package, RotateCcw, UserRound, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';

export const statusLabel = (status?: string) => (status || 'CREATED').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (m: string) => m.toUpperCase());

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiClient.get(`/orders/${id}`).then((res: any) => res.data),
    enabled: Boolean(id),
  });
  
  const { data: apiTracking } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => apiClient.get(`/orders/${id}/tracking`).then((res: any) => res.data),
    enabled: Boolean(id),
  });

  const tracking = Array.isArray(apiTracking) ? apiTracking : [];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '16rem', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary-500)" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-surface-900)' }}>Order not found</h2>
        <Button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="glass-panel bg-gradient-to-r from-teal-50 to-transparent shadow-sm p-6 rounded-xl border border-surface-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors">
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl font-bold text-surface-950">{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-3 text-surface-600 font-medium text-lg">{order.orderType} shipment - {order.paymentType} - ₹{order.totalCharge?.toFixed(2)}</p>
          </div>
          {order.status === 'FAILED' && (
            <Button onClick={() => navigate(`/orders/${id}/reschedule`)} className="btn-primary shadow-lg shadow-primary-500/20 py-3 px-6 text-base">
              <RotateCcw size={18} />
              Reschedule delivery
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <section className="glass-panel p-6 shadow-sm rounded-xl border border-surface-200 bg-white">
          <h2 className="mb-6 text-xl font-bold text-surface-950 border-b border-surface-200 pb-3">Tracking timeline</h2>
          <div className="flex flex-col gap-6">
            {tracking.map((item: any, index: number) => (
              <div key={item.id || index} className="grid grid-cols-[40px_1fr] gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 rounded-full bg-primary-50 text-primary-600 items-center justify-center text-sm font-bold border border-primary-100">{index + 1}</span>
                  {index < tracking.length - 1 && <span className="mt-2 h-full w-0.5 bg-surface-200" />}
                </div>
                <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-100 pb-2 mb-2">
                    <strong className="text-surface-950 text-lg">{statusLabel(item.newStatus || item.status)}</strong>
                    <span className="text-xs font-semibold text-surface-500 bg-surface-100 px-2 py-1 rounded-md">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-sm text-surface-600 font-medium">{item.remarks || 'Status updated'}</p>
                  <p className="mt-3 text-xs font-bold tracking-wider uppercase text-primary-600">{item.actorRole || 'SYSTEM'}</p>
                </div>
              </div>
            ))}
            {tracking.length === 0 && (
              <div className="text-center py-10 text-surface-500 font-medium">No tracking events recorded yet.</div>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <InfoPanel icon={Package} title="Pricing">
            <Row label="Billable weight" value={`${order.billableWeightKg || 0} kg`} />
            <Row label="Total charge" value={`₹${order.totalCharge?.toFixed(2)}`} />
          </InfoPanel>
          <InfoPanel icon={UserRound} title="Assigned agent">
            <p className="font-semibold text-surface-950 text-lg">{order.currentAgent?.user?.name || 'Pending assignment'}</p>
            <p className="text-sm text-surface-500 font-medium mt-1">{order.currentAgent?.user?.phone || 'Auto-assignment will retry'}</p>
          </InfoPanel>
          <InfoPanel icon={CalendarClock} title="Delivery window">
            <p className="font-semibold text-surface-950 text-lg">Today, 2 PM - 7 PM</p>
            <p className="text-sm text-surface-500 font-medium mt-1">{order.status === 'FAILED' ? 'Needs customer action' : 'On active route'}</p>
          </InfoPanel>
        </aside>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressCard title="Pickup" address={order.pickupAddress} />
        <AddressCard title="Drop" address={order.dropAddress} />
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm py-2 border-b border-surface-100 last:border-0">
    <span className="text-surface-500 font-medium">{label}</span>
    <strong className="text-surface-950">{value}</strong>
  </div>
);

const InfoPanel = ({ icon: Icon, title, children }: any) => (
  <section className="glass-panel p-6 shadow-sm rounded-xl border border-surface-200 bg-white hover:shadow-md transition-shadow">
    <div className="mb-5 flex items-center gap-3 border-b border-surface-200 pb-3">
      <div className="rounded-full bg-primary-50 p-2 text-primary-600 shadow-sm">
        <Icon size={20} />
      </div>
      <h2 className="font-bold text-surface-950 text-lg">{title}</h2>
    </div>
    <div className="flex flex-col gap-1">{children}</div>
  </section>
);

const AddressCard = ({ title, address }: any) => (
  <section className="glass-panel p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-xl border border-surface-200 bg-white">
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
      <MapPin size={100} />
    </div>
    <div className="relative z-10">
      <div className="mb-4 flex items-center gap-3 border-b border-surface-200 pb-3 w-fit">
        <div className="rounded-full bg-primary-50 p-2 text-primary-600 shadow-sm">
          <MapPin size={20} />
        </div>
        <h2 className="font-bold text-surface-950 text-lg">{title} address</h2>
      </div>
      <p className="font-bold text-surface-950 text-lg">{address?.contactName}</p>
      <p className="text-sm text-surface-600 font-medium mt-2 leading-relaxed">{address?.line1}, <br/>{address?.city}, {address?.state} - {address?.pincode}</p>
      <p className="mt-3 text-sm font-semibold text-primary-600 tracking-wide">{address?.contactPhone}</p>
    </div>
  </section>
);
