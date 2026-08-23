import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Map, Plus, Trash2, X } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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
    <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-surface-950)' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-surface-500)' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export const ZoneManagementPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['zones'],
    queryFn: () => apiClient.get('/admin/zones').then((res: any) => res.data?.data ?? res.data),
  });

  const createMutation = useMutation({
    mutationFn: () => apiClient.post('/admin/zones', form),
    onSuccess: () => {
      toast.success('Zone created!');
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      setShowModal(false);
      setForm({ name: '', code: '' });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create zone'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/zones/${id}`),
    onSuccess: () => {
      toast.success('Zone deleted');
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Cannot delete zone'),
  });

  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <Header title="Zone management" subtitle="Zones drive intra/inter pricing and agent dispatch." icon={Map} />
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
          <Button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Add zone</Button>
        </div>
        <DataTable
          columns={[
            { key: 'name', header: 'Zone' },
            { key: 'code', header: 'Code' },
            { key: 'areas', header: 'Areas', render: (item: any) => item.areas?.length ?? item._count?.areas ?? 0 },
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
        <Modal title="Add new zone" onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Zone name" placeholder="e.g. North" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <Input label="Zone code" placeholder="e.g. NORTH" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button className="btn-primary" style={{ flex: 1 }} onClick={() => createMutation.mutate()} isLoading={createMutation.isPending}>Create zone</Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
