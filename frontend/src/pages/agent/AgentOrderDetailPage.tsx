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
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors">
        <ArrowLeft size={16} />
        Back
      </button>
      
      <section className="glass-panel p-6 shadow-sm border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50 to-transparent">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl font-bold text-surface-950">{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-3 text-lg text-surface-700">{order.dropAddress?.line1}, {order.dropAddress?.city} - {order.dropAddress?.pincode}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {actions.filter((status) => status !== 'FAILED').map((status) => (
              <Button 
                key={status} 
                onClick={() => mutation.mutate({ status, remarks: `Agent moved order to ${status}` })} 
                isLoading={mutation.isPending} 
                className="btn-primary shadow-lg py-4 text-base w-full sm:w-auto"
              >
                <CheckCircle2 size={20} />
                {status.replaceAll('_', ' ')}
              </Button>
            ))}
            {actions.includes('FAILED') && (
              <Button 
                variant="danger" 
                onClick={() => setFailureOpen(true)} 
                className="shadow-lg py-4 text-base w-full sm:w-auto"
              >
                <XCircle size={20} />
                Mark failed
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <Card icon={MapPin} title="Pickup" text={`${order.pickupAddress?.line1}, ${order.pickupAddress?.pincode}`} />
        <Card icon={MapPin} title="Drop" text={`${order.dropAddress?.line1}, ${order.dropAddress?.pincode}`} />
        <Card icon={PackageCheck} title="Collection" text={order.paymentType === 'COD' ? `₹${order.totalCharge?.toFixed(2)}` : 'Prepaid order'} />
      </div>

      <Modal isOpen={failureOpen} onClose={() => setFailureOpen(false)} title="Failure reason">
        <div className="space-y-5 mt-2">
          <Select label="Select reason for failure" value={failureReason} onChange={(event) => setFailureReason(event.target.value)} options={[
            { value: 'CUSTOMER_UNAVAILABLE', label: 'Customer unavailable' },
            { value: 'ADDRESS_NOT_FOUND', label: 'Address not found' },
            { value: 'PAYMENT_DECLINED', label: 'Payment declined' },
          ]} className="w-full" />
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
            <Button variant="outline" onClick={() => setFailureOpen(false)} className="px-6">Cancel</Button>
            <Button variant="danger" isLoading={mutation.isPending} onClick={() => mutation.mutate({ status: 'FAILED', failureReason, remarks: 'Delivery attempt failed' })} className="px-6">Submit failure</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Card = ({ icon: Icon, title, text }: any) => (
  <section className="glass-panel p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200 bg-white">
    <div className="rounded-xl bg-primary-50 p-4 w-fit text-primary-600 mb-5 shadow-sm inline-flex items-center justify-center">
      <Icon size={28} />
    </div>
    <h2 className="font-bold text-surface-950 text-xl">{title}</h2>
    <p className="mt-3 text-surface-700 font-medium leading-relaxed">{text}</p>
  </section>
);

