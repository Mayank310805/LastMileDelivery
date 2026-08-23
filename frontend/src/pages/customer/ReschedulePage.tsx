import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CalendarDays, RotateCcw } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ReschedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [date, setDate] = useState(tomorrow);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post(`/orders/${id}/reschedule`, { newScheduledDate: new Date(date).toISOString() });
      toast.success('Delivery rescheduled and reassignment started');
      navigate(`/orders/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not reschedule delivery');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors">
        <ArrowLeft size={16} />
        Back
      </button>
      <section className="glass-panel p-8 shadow-md">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-5 border-b border-surface-200/50 pb-6">
          <div className="rounded-xl bg-warning-50 p-4 text-warning-600 shadow-sm">
            <RotateCcw size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-950">Reschedule failed delivery</h1>
            <p className="mt-2 text-surface-600 text-lg leading-relaxed">Choose a future delivery date. The system will clear the current agent and trigger reassignment.</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <Input label="New delivery date" type="date" min={tomorrow} value={date} onChange={(event) => setDate(event.target.value)} icon={<CalendarDays size={18} />} required />
          <div className="rounded-xl border border-surface-200 bg-surface-50/50 p-5 text-sm text-surface-600 shadow-inner">
            <span className="font-semibold text-surface-900">Note:</span> Reschedules are limited to three attempts per order and are recorded in the immutable tracking timeline.
          </div>
          <div className="pt-2">
            <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto shadow-lg shadow-primary-500/20 text-base py-3 px-6">
              <CalendarDays size={18} />
              Confirm reschedule
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};
