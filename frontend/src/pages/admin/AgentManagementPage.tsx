import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Users, X } from 'lucide-react';
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

export const AgentManagementPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: 'Agent@1234', zoneId: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => apiClient.get('/agents').then((res: any) => res.data),
  });

  const { data: zonesData } = useQuery({
    queryKey: ['zones'],
    queryFn: () => apiClient.get('/admin/zones').then((res: any) => res.data?.data ?? res.data),
  });

  const zones = Array.isArray(zonesData) ? zonesData : [];

  const createMutation = useMutation({
    mutationFn: () => apiClient.post('/auth/register', { ...form, role: 'AGENT', currentZoneId: form.zoneId }),
    onSuccess: () => {
      toast.success('Agent created! Default password: Agent@1234');
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', password: 'Agent@1234', zoneId: '' });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create agent'),
  });

  const agents = Array.isArray(data) ? data : [];

  const columns = [
    { key: 'name', header: 'Agent', render: (item: any) => item.user?.name ?? item.name },
    { key: 'email', header: 'Email', render: (item: any) => item.user?.email ?? item.email },
    { key: 'zone', header: 'Zone', render: (item: any) => item.currentZone?.name || '-' },
    { key: 'capacity', header: 'Capacity', render: (item: any) => `${item.activeOrders ?? 0}/${item.maxConcurrentOrders ?? 5}` },
    {
      key: 'isAvailable',
      header: 'Availability',
      render: (item: any) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: item.isAvailable ? 'rgba(16,185,129,0.15)' : 'var(--color-surface-100)', color: item.isAvailable ? 'var(--color-success-500)' : 'var(--color-surface-500)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', marginRight: '6px', background: item.isAvailable ? 'var(--color-success-500)' : 'var(--color-surface-400)' }} />
          {item.isAvailable ? 'Available' : 'Offline'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Header title="Agent management" subtitle="Control fleet capacity, zone assignments, and availability." icon={Users} />
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
          <Button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Add agent</Button>
        </div>
        <DataTable columns={columns} data={agents} isLoading={isLoading} />
      </section>

      {showModal && (
        <Modal title="Add new delivery agent" onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Full name" placeholder="e.g. Ravi Kumar" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <Input label="Email" type="email" placeholder="agent@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <Input label="Phone" placeholder="9999999999" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
            <Select
              label="Assign to zone"
              value={form.zoneId}
              onChange={e => setForm(f => ({ ...f, zoneId: e.target.value }))}
              options={zones.map((z: any) => ({ value: z.id, label: `${z.name} (${z.code})` }))}
              required
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-surface-500)', background: 'var(--color-surface-100)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>
              🔑 Default password will be: <strong>Agent@1234</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button className="btn-primary" style={{ flex: 1 }} onClick={() => createMutation.mutate()} isLoading={createMutation.isPending}>Create agent</Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
