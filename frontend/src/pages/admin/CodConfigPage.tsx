import { useQuery } from '@tanstack/react-query';
import { Percent, Plus } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';

export const CodConfigPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['cod-configs'],
    queryFn: () => apiClient.get('/admin/cod-configs').then((res: any) => res.data),
  });
  
  const rows = Array.isArray(data) ? data : [];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Header title="COD configuration" subtitle="Set flat or percentage collection surcharges by order type." icon={Percent} />
      <section className="glass-panel p-6 shadow-sm">
        <div className="mb-4 flex justify-end border-b border-surface-200/50 pb-4">
          <Button className="shadow-lg shadow-primary-500/20"><Plus size={18} /> Add COD rule</Button>
        </div>
        <DataTable columns={[
          { key: 'orderType', header: 'Order type' },
          { key: 'surchargeType', header: 'Type' },
          { key: 'value', header: 'Value', render: (item: any) => item.surchargeType === 'FLAT' ? `₹${item.value.toFixed(2)}` : `${item.value}%` },
          { key: 'minCharge', header: 'Minimum', render: (item: any) => `₹${item.minCharge.toFixed(2)}` },
          { key: 'isActive', header: 'Status', render: (item: any) => (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${item.isActive ? 'bg-success-50 text-success-700' : 'bg-surface-100 text-surface-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.isActive ? 'bg-success-500 animate-pulse' : 'bg-surface-400'}`}></span>
              {item.isActive ? 'Active' : 'Inactive'}
            </span>
          )},
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
