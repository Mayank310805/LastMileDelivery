import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, MapPin, PackageCheck, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

const nextStatus: Record<string, string[]> = {
  ASSIGNED: ['PICKED_UP', 'FAILED'],
  PICKED_UP: ['IN_TRANSIT', 'FAILED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
};

export const AgentOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [failureOpen, setFailureOpen] = useState(false);
  const [failureReason, setFailureReason] = useState('CUSTOMER_UNAVAILABLE');
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['agent-order', id],
    queryFn: () => apiClient.get(`/orders/${id}`).then((res: any) => res.data),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => apiClient.patch(`/orders/${id}/status`, payload),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['agent-order', id] });
      queryClient.invalidateQueries({ queryKey: ['agent-orders'] });
      setFailureOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Status update failed'),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-surface-900">Order not found</h2>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const actions = nextStatus[order.status] || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors">
        <ArrowLeft size={16} />
        Back
      </button>
      
      <section className="glass-panel p-6 shadow-sm bg-gradient-to-r from-primary-50/50 to-transparent">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-surface-950">{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-2 text-surface-600 font-medium">{order.dropAddress?.line1}, {order.dropAddress?.city} - {order.dropAddress?.pincode}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {actions.filter((status) => status !== 'FAILED').map((status) => (
              <Button key={status} onClick={() => mutation.mutate({ status, remarks: `Agent moved order to ${status}` })} isLoading={mutation.isPending} className="shadow-lg">
                <CheckCircle2 size={18} />
                {status.replaceAll('_', ' ')}
              </Button>
            ))}
            {actions.includes('FAILED') && (
              <Button variant="danger" onClick={() => setFailureOpen(true)} className="shadow-lg shadow-danger-500/20">
                <XCircle size={18} />
                Mark failed
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <Card icon={MapPin} title="Pickup" text={`${order.pickupAddress?.line1}, ${order.pickupAddress?.pincode}`} />
        <Card icon={MapPin} title="Drop" text={`${order.dropAddress?.line1}, ${order.dropAddress?.pincode}`} />
        <Card icon={PackageCheck} title="Collection" text={order.paymentType === 'COD' ? `₹${order.totalCharge?.toFixed(2)}` : 'Prepaid order'} />
      </div>

      <Modal isOpen={failureOpen} onClose={() => setFailureOpen(false)} title="Failure reason">
        <div className="space-y-4">
          <Select label="Reason" value={failureReason} onChange={(event) => setFailureReason(event.target.value)} options={[
            { value: 'CUSTOMER_UNAVAILABLE', label: 'Customer unavailable' },
            { value: 'ADDRESS_NOT_FOUND', label: 'Address not found' },
            { value: 'PAYMENT_DECLINED', label: 'Payment declined' },
          ]} />
          <div className="flex justify-end gap-3 pt-2 border-t border-surface-200">
            <Button variant="outline" onClick={() => setFailureOpen(false)}>Cancel</Button>
            <Button variant="danger" isLoading={mutation.isPending} onClick={() => mutation.mutate({ status: 'FAILED', failureReason, remarks: 'Delivery attempt failed' })}>Submit failure</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Card = ({ icon: Icon, title, text }: any) => (
  <section className="glass-panel p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="rounded-full bg-primary-50 p-3 w-fit text-primary-600 mb-4">
      <Icon size={24} />
    </div>
    <h2 className="font-bold text-surface-950 text-lg">{title}</h2>
    <p className="mt-2 text-surface-600 font-medium">{text}</p>
  </section>
);
