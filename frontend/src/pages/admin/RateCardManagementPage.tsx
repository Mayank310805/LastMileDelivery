import { useQuery } from '@tanstack/react-query';
import { CreditCard, Plus } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';

export const RateCardManagementPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['rate-cards'],
    queryFn: () => apiClient.get('/admin/rate-cards').then((res: any) => res.data),
  });
  
  const rows = Array.isArray(data) ? data : [];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Header title="Rate cards" subtitle="Configure B2B/B2C and intra/inter-zone pricing." icon={CreditCard} />
      <section className="glass-panel p-6 shadow-sm">
        <div className="mb-4 flex justify-end border-b border-surface-200/50 pb-4">
          <Button className="shadow-lg shadow-primary-500/20"><Plus size={18} /> Add rate</Button>
        </div>
        <DataTable columns={[
          { key: 'orderType', header: 'Order type' },
          { key: 'zoneRelation', header: 'Zone relation' },
          { key: 'basePrice', header: 'Base', render: (item: any) => `₹${item.basePrice.toFixed(2)}` },
          { key: 'baseWeightKg', header: 'Base kg' },
          { key: 'additionalPricePerKg', header: 'Extra per kg', render: (item: any) => `₹${item.additionalPricePerKg.toFixed(2)}` },
          { key: 'minCharge', header: 'Minimum', render: (item: any) => `₹${item.minCharge.toFixed(2)}` },
        ]} data={rows} isLoading={isLoading} />
      </section>
    </div>
  );
};

const Header = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-start gap-5 bg-gradient-to-r from-primary-50 to-transparent p-6 rounded-lg border-l-4 border-primary-500 shadow-sm">
    <div className="rounded-xl bg-white p-3 text-primary-600 shadow-sm"><Icon size={28} /></div>
    <div>
      <h1 className="text-3xl font-bold text-surface-950">{title}</h1>
      <p className="mt-2 text-surface-600 text-lg">{subtitle}</p>
    </div>
  </div>
);
