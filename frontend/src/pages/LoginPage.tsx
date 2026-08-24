import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Truck, CheckCircle2 } from 'lucide-react';
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
            Deliver better.<br/>Operate smarter.
          </h1>
          
          <p style={{ fontSize: '1.125rem', color: 'var(--color-surface-400)', marginBottom: '3rem', lineHeight: 1.6 }}>
            The complete solution for managing deliveries, dispatching agents, and tracking orders in real-time.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-surface-300)' }}>
              <CheckCircle2 size={20} color="var(--color-primary-500)" /> Real-time Tracking & ETAs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-surface-300)' }}>
              <CheckCircle2 size={20} color="var(--color-primary-500)" /> Smart Agent Dispatching
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-surface-300)' }}>
              <CheckCircle2 size={20} color="var(--color-primary-500)" /> Route Optimization
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

          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Welcome back</h2>
          <p style={{ color: 'var(--color-surface-500)', marginBottom: '2.5rem', fontSize: '1rem' }}>Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                icon={<Mail size={18} />}
                {...register('email')}
                error={errors.email?.message}
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
                Sign In
              </Button>
            </div>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-surface-500)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-primary-600)', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
