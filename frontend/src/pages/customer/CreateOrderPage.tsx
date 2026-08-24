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
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-primary-50 to-transparent p-6 rounded-lg border-l-4 border-primary-500 shadow-sm">
        <div>
          <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors">
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-surface-950">Create delivery order</h1>
          <p className="mt-2 text-lg text-surface-600">Price the shipment, confirm the charge, and start auto-assignment.</p>
        </div>
        <div className="glass-panel p-5 text-right bg-white shadow-sm rounded-xl border border-surface-200">
          <p className="text-xs font-bold uppercase tracking-wider text-surface-500">Billable weight preview</p>
          <p className="mt-1 text-3xl font-extrabold text-primary-600">{Math.max(Number(form.actualWeightKg), volumetricWeight).toFixed(2)} <span className="text-lg font-bold">kg</span></p>
          <p className="text-sm font-medium text-surface-500 mt-1">Volumetric {volumetricWeight.toFixed(2)} kg</p>
        </div>
      </div>

      <form onSubmit={quoteOrder} className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-6">
          <section className="glass-panel p-6 shadow-sm rounded-xl border border-surface-200 bg-white">
            <div className="mb-6 flex items-center gap-3 border-b border-surface-200 pb-4">
              <div className="rounded-full bg-primary-50 p-2 text-primary-600 shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-surface-950">Route details</h2>
                <p className="text-sm text-surface-500 mt-1">Use seeded pincodes 600001, 600020, 400001, or 400020 for a working demo.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(['pickupAddress', 'dropAddress'] as const).map((addressKey) => (
                <div key={addressKey} className="rounded-xl border border-surface-200 bg-surface-50 p-5 shadow-sm">
                  <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-600">
                    <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                    {addressKey === 'pickupAddress' ? 'Pickup' : 'Drop'} location
                  </h3>
                  <div className="flex flex-col gap-4">
                    <Input label="Contact name" value={form[addressKey].contactName} onChange={(e) => updateAddress(addressKey, 'contactName', e.target.value)} required />
                    <Input label="Phone" value={form[addressKey].contactPhone} onChange={(e) => updateAddress(addressKey, 'contactPhone', e.target.value)} required />
                    <Input label="Address line" value={form[addressKey].line1} onChange={(e) => updateAddress(addressKey, 'line1', e.target.value)} required />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" value={form[addressKey].city} onChange={(e) => updateAddress(addressKey, 'city', e.target.value)} required />
                      <Input label="State" value={form[addressKey].state} onChange={(e) => updateAddress(addressKey, 'state', e.target.value)} required />
                    </div>
                    <Input label="Pincode" value={form[addressKey].pincode} onChange={(e) => updateAddress(addressKey, 'pincode', e.target.value)} required />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6 shadow-sm rounded-xl border border-surface-200 bg-white">
            <div className="mb-6 flex items-center gap-3 border-b border-surface-200 pb-4">
              <div className="rounded-full bg-primary-50 p-2 text-primary-600 shadow-sm">
                <Ruler size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-surface-950">Package and payment</h2>
                <p className="text-sm text-surface-500 mt-1">Charges use max(actual weight, volumetric weight).</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input label="Length (cm)" type="number" min="1" value={form.lengthCm} onChange={(e) => updateField('lengthCm', e.target.value)} required />
              <Input label="Breadth (cm)" type="number" min="1" value={form.breadthCm} onChange={(e) => updateField('breadthCm', e.target.value)} required />
              <Input label="Height (cm)" type="number" min="1" value={form.heightCm} onChange={(e) => updateField('heightCm', e.target.value)} required />
              <Input label="Actual weight (kg)" type="number" min="0.1" step="0.1" value={form.actualWeightKg} onChange={(e) => updateField('actualWeightKg', e.target.value)} required />
              <Select label="Order type" value={form.orderType} onChange={(e) => updateField('orderType', e.target.value)} options={[{ value: 'B2C', label: 'B2C' }, { value: 'B2B', label: 'B2B' }]} />
              <Select label="Payment" value={form.paymentType} onChange={(e) => updateField('paymentType', e.target.value)} options={[{ value: 'PREPAID', label: 'Prepaid' }, { value: 'COD', label: 'Cash on delivery' }]} />
            </div>
          </section>
        </div>

        <aside className="sticky top-24 flex flex-col gap-5 self-start w-full">
          <div className="glass-panel p-6 shadow-lg border border-primary-100 rounded-xl bg-white">
            <div className="flex items-center gap-3 border-b border-surface-200 pb-4">
              <div className="rounded-full bg-primary-50 p-2 text-primary-600 shadow-sm">
                <Calculator size={20} />
              </div>
              <h2 className="text-xl font-bold text-surface-950">Quote summary</h2>
            </div>
            <div className="mt-6 flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center"><span className="text-surface-500 font-medium">Base charge</span><strong className="text-base">{quote ? `₹${quote.baseCharge?.toFixed(2)}` : '-'}</strong></div>
              <div className="flex justify-between items-center"><span className="text-surface-500 font-medium">COD surcharge</span><strong className="text-base">{quote ? `₹${quote.codSurcharge?.toFixed(2)}` : '-'}</strong></div>
              <div className="flex justify-between items-center"><span className="text-surface-500 font-medium">Billable weight</span><strong className="text-base">{quote ? `${quote.billableWeightKg} kg` : '-'}</strong></div>
              <div className="flex justify-between items-center"><span className="text-surface-500 font-medium">Zone relation</span><strong className="text-base px-2 py-1 bg-surface-100 rounded-md">{quote?.zoneRelation || '-'}</strong></div>
              <div className="border-t border-surface-200 pt-5 mt-1 flex justify-between items-center">
                <span className="font-bold text-surface-900 text-lg">Total</span>
                <strong className="text-3xl text-primary-600">{quote ? `₹${quote.totalCharge?.toFixed(2)}` : '₹0.00'}</strong>
              </div>
            </div>
            <div className="mt-8 grid gap-4">
              <Button type="submit" className="btn-secondary shadow-sm text-base py-3" isLoading={isQuoting}>
                <CreditCard size={18} />
                Calculate quote
              </Button>
              <Button type="button" disabled={!quote} isLoading={isCreating} onClick={createOrder} className="btn-primary shadow-lg shadow-primary-500/20 text-base py-3">
                <PackageCheck size={18} />
                Confirm order
              </Button>
            </div>
          </div>
          
          <div className="rounded-xl border border-success-200 bg-success-50 p-5 text-sm text-surface-700 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-success-700 mb-2"><CheckCircle2 size={18} /> Auto-assignment ready</div>
            <p className="leading-relaxed">After confirmation, the backend selects an available agent by zone and workload.</p>
          </div>
          
          <div className="rounded-xl border border-surface-200 bg-surface-50 p-5 text-sm text-surface-600 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-surface-700 mb-2">
              <Truck size={18} /> Activity logging
            </div>
            <p className="leading-relaxed">Every status change writes immutable tracking history and triggers notifications.</p>
          </div>
        </aside>
      </form>
    </div>
  );
};
