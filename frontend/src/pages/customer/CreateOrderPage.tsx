import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Calculator, CheckCircle2, CreditCard, MapPin, PackageCheck, Ruler, Truck } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const emptyAddress = {
  contactName: '',
  contactPhone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

const initialForm = {
  pickupAddress: { ...emptyAddress, city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
  dropAddress: { ...emptyAddress, city: 'Chennai', state: 'Tamil Nadu', pincode: '600020' },
  lengthCm: 20,
  breadthCm: 14,
  heightCm: 10,
  actualWeightKg: 1.2,
  orderType: 'B2C',
  paymentType: 'PREPAID',
};

export const CreateOrderPage = () => {
  const [form, setForm] = useState<any>(initialForm);
  const [quote, setQuote] = useState<any>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const volumetricWeight = useMemo(
    () => Number(((Number(form.lengthCm) * Number(form.breadthCm) * Number(form.heightCm)) / 5000).toFixed(3)),
    [form.lengthCm, form.breadthCm, form.heightCm]
  );

  const payload = () => ({
    ...form,
    lengthCm: Number(form.lengthCm),
    breadthCm: Number(form.breadthCm),
    heightCm: Number(form.heightCm),
    actualWeightKg: Number(form.actualWeightKg),
  });

  const updateAddress = (key: 'pickupAddress' | 'dropAddress', field: string, value: string) => {
    setForm((current: any) => ({ ...current, [key]: { ...current[key], [field]: value } }));
    setQuote(null);
  };

  const updateField = (field: string, value: string | number) => {
    setForm((current: any) => ({ ...current, [field]: value }));
    setQuote(null);
  };

  const quoteOrder = async (event?: FormEvent) => {
    event?.preventDefault();
    setIsQuoting(true);
    try {
      const response: any = await apiClient.post('/orders/quote', payload());
      setQuote(response.data);
      toast.success('Quote calculated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not calculate quote');
    } finally {
      setIsQuoting(false);
    }
  };

  const createOrder = async () => {
    setIsCreating(true);
    try {
      const response: any = await apiClient.post('/orders', payload());
      toast.success('Order created and assignment started');
      navigate(`/orders/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not create order');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(to right, rgba(59, 130, 246, 0.15), transparent)', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--color-primary-500)', boxShadow: 'var(--shadow-sm)', ...(window.innerWidth >= 1024 ? { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } : {}) }}>
        <div>
          <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-500)', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-surface-900)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-surface-500)'}>
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>Create delivery order</h1>
          <p style={{ marginTop: '0.5rem', fontSize: '1.125rem', color: 'var(--color-surface-600)' }}>Price the shipment, confirm the charge, and start auto-assignment.</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'right' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-surface-500)' }}>Billable weight preview</p>
          <p style={{ marginTop: '0.25rem', fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-primary-600)' }}>{Math.max(Number(form.actualWeightKg), volumetricWeight).toFixed(2)} <span style={{ fontSize: '1.125rem' }}>kg</span></p>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Volumetric {volumetricWeight.toFixed(2)} kg</p>
        </div>
      </div>

      <form onSubmit={quoteOrder} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: window.innerWidth >= 1280 ? '1fr 360px' : '1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section className="glass-panel" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
              <div style={{ borderRadius: '50%', background: 'var(--color-primary-50)', padding: '0.5rem', color: 'var(--color-primary-600)', boxShadow: 'var(--shadow-sm)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>Route details</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Use seeded pincodes 600001, 600020, 400001, or 400020 for a working demo.</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr' }}>
              {(['pickupAddress', 'dropAddress'] as const).map((addressKey) => (
                <div key={addressKey} style={{ borderRadius: '0.75rem', border: '1px solid var(--color-surface-200)', background: 'var(--color-surface-50)', padding: '1.25rem', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)' }}>
                  <h3 style={{ marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ height: '0.5rem', width: '0.5rem', borderRadius: '50%', background: 'var(--color-primary-500)' }}></span>
                    {addressKey === 'pickupAddress' ? 'Pickup' : 'Drop'} location
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Contact name" value={form[addressKey].contactName} onChange={(e) => updateAddress(addressKey, 'contactName', e.target.value)} required />
                    <Input label="Phone" value={form[addressKey].contactPhone} onChange={(e) => updateAddress(addressKey, 'contactPhone', e.target.value)} required />
                    <Input label="Address line" value={form[addressKey].line1} onChange={(e) => updateAddress(addressKey, 'line1', e.target.value)} required />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <Input label="City" value={form[addressKey].city} onChange={(e) => updateAddress(addressKey, 'city', e.target.value)} required />
                      <Input label="State" value={form[addressKey].state} onChange={(e) => updateAddress(addressKey, 'state', e.target.value)} required />
                    </div>
                    <Input label="Pincode" value={form[addressKey].pincode} onChange={(e) => updateAddress(addressKey, 'pincode', e.target.value)} required />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
              <div style={{ borderRadius: '50%', background: 'var(--color-primary-50)', padding: '0.5rem', color: 'var(--color-primary-600)', boxShadow: 'var(--shadow-sm)' }}>
                <Ruler size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>Package and payment</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-surface-500)', marginTop: '0.25rem' }}>Charges use max(actual weight, volumetric weight).</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr' }}>
              <Input label="Length (cm)" type="number" min="1" value={form.lengthCm} onChange={(e) => updateField('lengthCm', e.target.value)} required />
              <Input label="Breadth (cm)" type="number" min="1" value={form.breadthCm} onChange={(e) => updateField('breadthCm', e.target.value)} required />
              <Input label="Height (cm)" type="number" min="1" value={form.heightCm} onChange={(e) => updateField('heightCm', e.target.value)} required />
              <Input label="Actual weight (kg)" type="number" min="0.1" step="0.1" value={form.actualWeightKg} onChange={(e) => updateField('actualWeightKg', e.target.value)} required />
              <Select label="Order type" value={form.orderType} onChange={(e) => updateField('orderType', e.target.value)} options={[{ value: 'B2C', label: 'B2C' }, { value: 'B2B', label: 'B2B' }]} />
              <Select label="Payment" value={form.paymentType} onChange={(e) => updateField('paymentType', e.target.value)} options={[{ value: 'PREPAID', label: 'Prepaid' }, { value: 'COD', label: 'Cash on delivery' }]} />
            </div>
          </section>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '6rem', alignSelf: 'start' }}>
          <div className="glass-panel" style={{ boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-primary-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-surface-200)', paddingBottom: '1rem' }}>
              <div style={{ borderRadius: '50%', background: 'var(--color-primary-50)', padding: '0.5rem', color: 'var(--color-primary-600)', boxShadow: 'var(--shadow-sm)' }}>
                <Calculator size={20} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>Quote summary</h2>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--color-surface-500)', fontWeight: 500 }}>Base charge</span><strong style={{ fontSize: '1rem' }}>{quote ? `₹${quote.baseCharge?.toFixed(2)}` : '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--color-surface-500)', fontWeight: 500 }}>COD surcharge</span><strong style={{ fontSize: '1rem' }}>{quote ? `₹${quote.codSurcharge?.toFixed(2)}` : '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--color-surface-500)', fontWeight: 500 }}>Billable weight</span><strong style={{ fontSize: '1rem' }}>{quote ? `${quote.billableWeightKg} kg` : '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--color-surface-500)', fontWeight: 500 }}>Zone relation</span><strong style={{ fontSize: '1rem', padding: '0.25rem 0.5rem', background: 'var(--color-surface-100)', borderRadius: '0.375rem' }}>{quote?.zoneRelation || '-'}</strong></div>
              <div style={{ borderTop: '1px solid var(--color-surface-200)', paddingTop: '1.25rem', marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--color-surface-900)', fontSize: '1.125rem' }}>Total</span>
                <strong style={{ fontSize: '1.875rem', color: 'var(--color-primary-600)' }}>{quote ? `₹${quote.totalCharge?.toFixed(2)}` : '₹0.00'}</strong>
              </div>
            </div>
            <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
              <Button type="submit" className="btn-secondary" isLoading={isQuoting} style={{ boxShadow: 'var(--shadow-md)', fontSize: '1rem', padding: '0.75rem' }}>
                <CreditCard size={18} />
                Calculate quote
              </Button>
              <Button type="button" disabled={!quote} isLoading={isCreating} onClick={createOrder} className="btn-primary" style={{ boxShadow: '0 10px 15px -3px rgba(20,184,166,0.3)', fontSize: '1rem', padding: '0.75rem' }}>
                <PackageCheck size={18} />
                Confirm order
              </Button>
            </div>
          </div>
          
          <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-success-600)', background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', fontSize: '0.875rem', color: 'var(--color-surface-300)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: 'var(--color-success-500)', marginBottom: '0.5rem' }}><CheckCircle2 size={18} /> Auto-assignment ready</div>
            <p style={{ lineHeight: 1.6, opacity: 0.9 }}>After confirmation, the backend selects an available agent by zone and workload.</p>
          </div>
          
          <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-surface-200)', background: 'var(--color-surface-100)', padding: '1.25rem', fontSize: '0.875rem', color: 'var(--color-surface-400)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: 'var(--color-surface-600)', marginBottom: '0.5rem' }}>
              <Truck size={18} /> Activity logging
            </div>
            <p style={{ lineHeight: 1.6 }}>Every status change writes immutable tracking history and triggers notifications.</p>
          </div>
        </aside>
      </form>
    </div>
  );
};
