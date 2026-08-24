import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, Phone, Truck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const user = await registerUser(data);
      const routes: Record<string, string> = { ADMIN: '/admin', AGENT: '/agent', CUSTOMER: '/dashboard' };
      const defaultRoute = user ? routes[user.role] : '/dashboard';
      navigate(defaultRoute, { replace: true });
    } catch (error) {
      // Error is handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* LEFT: Brand Banner */}
      <div style={{ flex: 1, backgroundColor: 'var(--color-surface-900)', background: 'linear-gradient(135deg, var(--color-surface-900) 0%, #1e293b 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', color: 'white' }} className="hidden lg-flex">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{ width: '3rem', height: '3rem', backgroundColor: 'var(--color-primary-600)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>LastMile</span>
          </div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
            Join LastMile
          </h1>
          
          <p style={{ fontSize: '1.125rem', color: 'var(--color-surface-400)', marginBottom: '3rem', lineHeight: 1.6 }}>
            Create an account to start tracking your deliveries in real-time with precise ETAs and status updates.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-surface-300)' }}>
              <CheckCircle2 size={20} color="var(--color-primary-500)" /> Fast Setup
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-surface-300)' }}>
              <CheckCircle2 size={20} color="var(--color-primary-500)" /> Live Updates
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }} className="lg-hidden">
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--color-primary-600)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>LastMile</span>
          </div>

          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Create an account</h2>
          <p style={{ color: 'var(--color-surface-500)', marginBottom: '2.5rem', fontSize: '1rem' }}>Enter your details to get started.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={<User size={18} />}
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                icon={<Mail size={18} />}
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={<Phone size={18} />}
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <Button type="submit" className="w-full btn-primary" isLoading={isLoading} style={{ width: '100%', padding: '0.625rem', fontSize: '1rem' }}>
                Create Account
              </Button>
            </div>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-surface-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary-600)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
