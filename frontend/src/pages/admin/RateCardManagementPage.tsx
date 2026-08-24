import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>Rate Cards</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Configure B2B/B2C and intra/inter-zone pricing.</p>
      </div>

      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
          <Button className="btn btn-primary"><Plus size={16} style={{ marginRight: '0.5rem' }} /> Add rate</Button>
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
