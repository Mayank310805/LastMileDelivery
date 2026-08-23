import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, Phone, Truck } from 'lucide-react';
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
    <div className="auth-layout animate-fade-in">
      <div className="auth-banner">
        <div style={{ textAlign: 'center', color: 'white', maxWidth: '32rem', padding: '0 2rem', zIndex: 10 }} className="animate-fade-in delay-200">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '6rem', height: '6rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'var(--shadow-neon)' }}>
              <Truck size={48} color="white" />
            </div>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>Join LastMile</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Create an account to start tracking your deliveries in real-time with precise ETAs and status updates.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', textAlign: 'left', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2.5rem' }}>
            <div className="animate-fade-in delay-300">
              <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                <span style={{ color: 'var(--color-primary-400)', textShadow: '0 0 10px var(--color-primary-400)' }}>✓</span> Fast Setup
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>Get started in seconds</p>
            </div>
            <div className="animate-fade-in delay-300">
              <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                <span style={{ color: 'var(--color-accent-400)', textShadow: '0 0 10px var(--color-accent-400)' }}>✓</span> Live Updates
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>Know exactly where it is</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-box animate-fade-in delay-100">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-400)', marginBottom: '2rem' }} className="lg-hidden">
            <Truck size={28} strokeWidth={2.5} />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>LastMile</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>Create an account</h2>
          <p style={{ color: 'var(--color-surface-500)', marginBottom: '2.5rem', fontSize: '1rem' }}>Enter your details to get started.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="animate-fade-in delay-200">
              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={<User size={18} />}
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }} className="animate-fade-in delay-200">
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                icon={<Mail size={18} />}
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }} className="animate-fade-in delay-300">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={<Phone size={18} />}
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }} className="animate-fade-in delay-300">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            <div style={{ marginTop: '2.5rem' }} className="animate-fade-in delay-300">
              <Button type="submit" className="w-full btn-primary" isLoading={isLoading} style={{ width: '100%', padding: '0.875rem' }}>
                Create Account
              </Button>
            </div>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9375rem', color: 'var(--color-surface-500)' }} className="animate-fade-in delay-300">
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-primary-400)', letterSpacing: '0.025em' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
