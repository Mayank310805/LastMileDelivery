import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MapPin, Plus, Trash2, X } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/ui/DataTable';

const Header = ({ title, subtitle, icon: Icon }: any) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', background: 'linear-gradient(to right, rgba(59,130,246,0.15), transparent)', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--color-primary-500)' }}>
    <div style={{ borderRadius: '0.75rem', background: 'var(--color-surface-200)', padding: '0.75rem', color: 'var(--color-primary-400)' }}><Icon size={28} /></div>
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-surface-950)' }}>{title}</h1>
      <p style={{ marginTop: '0.5rem', color: 'var(--color-surface-500)', fontSize: '1rem' }}>{subtitle}</p>
    </div>
  </div>
);

const Modal = ({ title, onClose, children }: any) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
    <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-surface-950)' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-surface-500)' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export const AreaManagementPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', pincode: '', city: '', state: '', zoneId: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['areas'],
    queryFn: () => apiClient.get('/admin/areas').then((res: any) => res.data?.data ?? res.data),
  });

  const { data: zonesData } = useQuery({
    queryKey: ['zones'],
    queryFn: () => apiClient.get('/admin/zones').then((res: any) => res.data?.data ?? res.data),
  });

  const zones = Array.isArray(zonesData) ? zonesData : [];

  const createMutation = useMutation({
    mutationFn: () => apiClient.post('/admin/areas', form),
    onSuccess: () => {
      toast.success('Area created!');
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      setShowModal(false);
      setForm({ name: '', pincode: '', city: '', state: '', zoneId: '' });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create area'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/areas/${id}`),
    onSuccess: () => {
      toast.success('Area deleted');
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Cannot delete area'),
  });

  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <Header title="Area management" subtitle="Map pincodes to zones for pricing and auto-dispatch." icon={MapPin} />
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
          <Button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Add area</Button>
        </div>
        <DataTable
          columns={[
            { key: 'name', header: 'Area' },
            { key: 'pincode', header: 'Pincode' },
            { key: 'city', header: 'City' },
            { key: 'state', header: 'State' },
            { key: 'zone', header: 'Zone', render: (item: any) => item.zone?.name || '-' },
            {
              key: 'actions', header: '', render: (item: any) => (
                <button onClick={() => deleteMutation.mutate(item.id)} style={{ color: 'var(--color-danger-500)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                  <Trash2 size={14} /> Delete
                </button>
              )
            },
          ]}
          data={rows} isLoading={isLoading}
        />
      </section>

      {showModal && (
        <Modal title="Add new area" onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Area name" placeholder="e.g. Chennai North" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <Input label="Pincode" placeholder="e.g. 600001" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="City" placeholder="e.g. Chennai" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
              <Input label="State" placeholder="e.g. Tamil Nadu" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required />
            </div>
            <Select
              label="Assign to zone"
              value={form.zoneId}
              onChange={e => setForm(f => ({ ...f, zoneId: e.target.value }))}
              options={zones.map((z: any) => ({ value: z.id, label: `${z.name} (${z.code})` }))}
              required
            />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button className="btn-primary" style={{ flex: 1 }} onClick={() => createMutation.mutate()} isLoading={createMutation.isPending}>Create area</Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
