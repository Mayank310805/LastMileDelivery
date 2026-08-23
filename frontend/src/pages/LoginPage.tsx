import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const user = await login(data);
      const routes: Record<string, string> = { ADMIN: '/admin', AGENT: '/agent', CUSTOMER: '/dashboard' };
      const defaultRoute = user ? routes[user.role] : '/dashboard';
      const from = location.state?.from?.pathname && location.state?.from?.pathname !== '/' 
        ? location.state.from.pathname 
        : defaultRoute;
      navigate(from, { replace: true });
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>LastMile Tracker</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            The premium solution for managing deliveries, dispatching agents, and tracking orders in real-time.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '0.75rem 1.25rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--color-primary-400)', boxShadow: '0 0 10px var(--color-primary-400)' }}></span> Real-time Tracking
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '0.75rem 1.25rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--color-accent-400)', boxShadow: '0 0 10px var(--color-accent-400)' }}></span> Smart Dispatch
            </span>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-box animate-fade-in delay-100">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-400)', marginBottom: '2rem' }} className="lg-hidden">
            <Truck size={28} strokeWidth={2.5} />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>LastMile</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>Welcome back</h2>
          <p style={{ color: 'var(--color-surface-500)', marginBottom: '2.5rem', fontSize: '1rem' }}>Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="animate-fade-in delay-200">
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                icon={<Mail size={18} />}
                {...register('email')}
                error={errors.email?.message}
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
                Sign In
              </Button>
            </div>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9375rem', color: 'var(--color-surface-500)' }} className="animate-fade-in delay-300">
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-primary-400)', letterSpacing: '0.025em' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
