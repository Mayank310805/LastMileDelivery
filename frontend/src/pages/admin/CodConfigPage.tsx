import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>COD Configuration</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Set flat or percentage collection surcharges by order type.</p>
      </div>

      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
          <Button className="btn btn-primary"><Plus size={16} style={{ marginRight: '0.5rem' }} /> Add COD rule</Button>
        </div>
        <DataTable columns={[
          { key: 'orderType', header: 'Order type' },
          { key: 'surchargeType', header: 'Type' },
          { key: 'value', header: 'Value', render: (item: any) => item.surchargeType === 'FLAT' ? `₹${item.value.toFixed(2)}` : `${item.value}%` },
          { key: 'minCharge', header: 'Minimum', render: (item: any) => `₹${item.minCharge.toFixed(2)}` },
          { key: 'isActive', header: 'Status', render: (item: any) => (
            <span className={`badge ${item.isActive ? 'badge-success' : 'badge-info'}`}>
              {item.isActive ? 'Active' : 'Inactive'}
            </span>
          )},
        ]} data={rows} isLoading={isLoading} />
      </section>
    </div>
  );
};
