import { useNavigate } from 'react-router-dom';
import { Truck, ArrowRight, Zap, MapPin, Bell, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const navLink = (color = 'var(--color-surface-500)') => ({
  cursor: 'pointer',
  transition: 'color 0.2s',
  color,
  textDecoration: 'none',
  fontSize: '0.9375rem',
  fontWeight: 600,
});

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--color-surface-50)', color: 'var(--color-surface-950)', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(9,17,29,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'fixed', width: '100%', top: 0, zIndex: 100, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: 'var(--color-primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={20} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>LastMile</span>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {['#home', '#about', '#services', '#membership', '#contact'].map((href, i) => (
            <a key={href} href={href} style={navLink()}
              onMouseOver={e => (e.currentTarget.style.color = 'white')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--color-surface-500)')}>
              {['Home', 'About', 'Services', 'Membership', 'Contact'][i]}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" onClick={() => navigate('/login')} style={{ fontSize: '0.9375rem' }}>Log In</Button>
          <Button className="btn-primary" onClick={() => navigate('/register')} style={{ fontSize: '0.9375rem' }}>Sign Up Free</Button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '5rem' }}>
        {/* Full background city map image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/city-map.png" alt="City delivery map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,6,23,0.6) 0%, rgba(2,6,23,0.85) 60%, var(--color-surface-50) 100%)' }} />
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2.5rem', display: 'flex', alignItems: 'center', gap: '5rem', position: 'relative', zIndex: 10, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ flex: 1, minWidth: 0 }} className="animate-fade-in">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '2rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary-400)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-300)' }}>Live delivery network — Always On</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.75rem', letterSpacing: '-0.04em', color: 'white' }}>
              Deliver Anything,<br />
              <span style={{ color: 'var(--color-primary-400)' }}>Anywhere</span> — Fast.
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-surface-400)', marginBottom: '2.5rem', lineHeight: 1.8, maxWidth: '34rem' }}>
              LastMile connects businesses and customers through an intelligent delivery network with real-time tracking, dynamic pricing, and automated driver assignment.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.0625rem', fontWeight: 700 }} onClick={() => navigate('/register')}>
                Get Started Free <ArrowRight size={18} />
              </Button>
              <Button variant="outline" style={{ padding: '1rem 2rem', fontSize: '1.0625rem' }} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn More <ChevronDown size={18} />
              </Button>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }} className="animate-fade-in delay-200">
            <div style={{ width: '100%', height: '420px', borderRadius: '1.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 64px rgba(0,0,0,0.6)', position: 'relative' }}>
              <img src="/delivery-hero.png" alt="Courier handing package" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.7) 0%, transparent 50%)' }} />
              {/* Floating stat cards */}
              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-surface-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deliveries today</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-400)', margin: 0 }}>2,841</p>
              </div>
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', border: '1px solid rgba(16,185,129,0.3)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-success-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ On-time rate</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', margin: 0 }}>99.9%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────── */}
      <section id="about" style={{ padding: '7rem 2.5rem', background: 'var(--color-surface-100)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: 'var(--color-primary-400)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Who We Are</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem' }}>Built for modern logistics</h2>
            <p style={{ color: 'var(--color-surface-400)', fontSize: '1.125rem', lineHeight: 1.8, maxWidth: '42rem', margin: '0 auto' }}>
              LastMile is a state-of-the-art delivery management platform. We bridge the gap between businesses and their customers through an ultra-fast, reliable, and transparent courier network — powered by intelligent automation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
              <img src="/city-map.png" alt="City delivery network" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.2), transparent)' }} />
            </div>
            <div>
              {[
                { icon: Zap, color: 'var(--color-primary-400)', title: 'Instant Assignment', desc: 'Orders are routed to the nearest available driver in under 12 minutes on average.' },
                { icon: MapPin, color: 'var(--color-accent-400)', title: 'Zone Intelligence', desc: 'Smart zone-based pricing ensures you always pay the fairest rate for your route.' },
                { icon: Bell, color: 'var(--color-success-500)', title: 'Real-time Alerts', desc: 'Email and SMS notifications keep customers in the loop at every single stage.' },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>{title}</h3>
                    <p style={{ color: 'var(--color-surface-400)', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '3.5rem', textAlign: 'center' }}>
            {[
              { num: '10k+', label: 'Deliveries Daily', color: 'var(--color-primary-400)' },
              { num: '99.9%', label: 'On-time Rate', color: 'var(--color-accent-400)' },
              { num: '500+', label: 'Active Agents', color: 'var(--color-success-500)' },
            ].map(({ num, label, color }) => (
              <div key={label} className="glass-panel" style={{ padding: '2rem' }}>
                <p style={{ fontSize: '2.75rem', fontWeight: 900, color, margin: '0 0 0.5rem', letterSpacing: '-0.04em' }}>{num}</p>
                <p style={{ color: 'var(--color-surface-500)', fontSize: '1rem', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workspaces ─────────────────────────────────────────── */}
      <section style={{ padding: '7rem 2.5rem', background: 'var(--color-surface-50)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: 'var(--color-primary-400)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Choose Your Role</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Enter Your Workspace</h2>
            <p style={{ color: 'var(--color-surface-500)', fontSize: '1.125rem' }}>Access specialized tools built for your role in the delivery chain.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { img: '/role-customer.png', title: 'Customers', desc: 'Create orders, track deliveries in real-time, and get instant dynamic pricing quotes.', btn: 'Login as Customer', borderColor: 'rgba(59,130,246,0.3)', btnStyle: {} },
              { img: '/role-driver.png', title: 'Delivery Drivers', desc: 'View assigned routes, update delivery statuses, and manage your availability easily.', btn: 'Login as Driver', borderColor: 'rgba(45,212,191,0.3)', btnStyle: { borderColor: 'var(--color-accent-400)', color: 'var(--color-accent-400)' } },
              { img: '/role-admin.png', title: 'Administrators', desc: 'Control operations, configure zones, manage rate cards, and oversee the entire fleet.', btn: 'Login as Admin', borderColor: 'rgba(16,185,129,0.3)', btnStyle: { borderColor: 'var(--color-success-500)', color: 'var(--color-success-500)' } },
            ].map(({ img, title, desc, btn, borderColor, btnStyle }) => (
              <div key={title} className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: `1px solid ${borderColor}`, transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 48px rgba(0,0,0,0.5)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} />
                </div>
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>{title}</h3>
                  <p style={{ color: 'var(--color-surface-400)', fontSize: '0.9375rem', lineHeight: 1.7, flex: 1, margin: '0 0 1.75rem' }}>{desc}</p>
                  <Button className="btn-outline w-full" onClick={() => navigate('/login')} style={{ ...btnStyle, fontWeight: 700, fontSize: '0.9375rem' }}>{btn}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────── */}
      <section id="services" style={{ padding: '7rem 2.5rem', background: 'var(--color-surface-100)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: 'var(--color-primary-400)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>What We Offer</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem' }}>Our Premium Services</h2>
            <p style={{ color: 'var(--color-surface-400)', fontSize: '1.125rem', maxWidth: '38rem', margin: '0 auto' }}>
              End-to-end logistics, from first click to front door.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {[
              { icon: '⚡', color: 'var(--color-primary-400)', bg: 'rgba(59,130,246,0.1)', title: 'Dynamic Pricing', desc: 'Volumetric engine calculates the most optimal rate based on size, weight, and live area demand.' },
              { icon: '🤖', color: 'var(--color-accent-400)', bg: 'rgba(45,212,191,0.1)', title: 'Auto Assignment', desc: 'Orders are routed to the closest available agent via smart workload-balancing algorithms.' },
              { icon: '📍', color: '#f97316', bg: 'rgba(249,115,22,0.1)', title: 'Real-time Tracking', desc: 'Customers get pinpoint GPS updates, ETAs, and instant email/SMS notifications at every stage.' },
              { icon: '🛡️', color: 'var(--color-success-500)', bg: 'rgba(16,185,129,0.1)', title: 'Guaranteed SLA', desc: 'Admin override and automatic rescheduling ensure every package reaches its destination.' },
            ].map(({ icon, color, bg, title, desc }) => (
              <div key={title} className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '0.875rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>{icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color, marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--color-surface-400)', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Membership Flash Cards ─────────────────────────────── */}
      <section id="membership" style={{ padding: '7rem 2.5rem', background: 'var(--color-surface-50)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-primary-400)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Membership Plans</h2>
          <p style={{ color: 'var(--color-surface-400)', fontSize: '1.125rem', marginBottom: '4rem' }}>Choose the right logistics tier for your business scale.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left', alignItems: 'start' }}>
            {/* Free */}
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px) scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 32px 64px rgba(0,0,0,0.5)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-surface-600)', marginBottom: '0.5rem' }}>Free</h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>$0<span style={{ fontSize: '1.125rem', color: 'var(--color-surface-500)', fontWeight: 500 }}>/mo</span></div>
              <p style={{ color: 'var(--color-surface-500)', marginBottom: '2rem', fontSize: '0.9375rem' }}>Perfect for individuals & small businesses.</p>
              {['Basic order tracking', 'Up to 50 orders/month', 'Email notifications', 'Standard support'].map(f => <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-surface-300)', fontSize: '0.9375rem', marginBottom: '0.75rem' }}><CheckCircle size={16} color="var(--color-surface-500)" />{f}</div>)}
              <Button className="btn-outline w-full" style={{ marginTop: '2rem' }}>Get Started</Button>
            </div>

            {/* Pro — highlighted */}
            <div className="animate-fade-in delay-200" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(30,41,59,0.7))', backdropFilter: 'blur(20px)', border: '2px solid var(--color-primary-500)', borderRadius: '1.5rem', position: 'relative', transform: 'scale(1.04)', boxShadow: '0 20px 60px rgba(59,130,246,0.25)', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04) translateY(-10px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 40px 80px rgba(59,130,246,0.4)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04) translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(59,130,246,0.25)'; }}>
              <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary-500)', color: 'white', padding: '0.3rem 1.25rem', borderRadius: '0 0 0.75rem 0.75rem', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.05em' }}>MOST POPULAR</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-300)', marginBottom: '0.5rem', marginTop: '0.5rem' }}>Pro</h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>$49<span style={{ fontSize: '1.125rem', color: 'var(--color-surface-500)', fontWeight: 500 }}>/mo</span></div>
              <p style={{ color: 'var(--color-surface-400)', marginBottom: '2rem', fontSize: '0.9375rem' }}>For growing businesses who need power.</p>
              {['Advanced analytics dashboard', 'Dynamic routing engine', 'Unlimited orders', 'Priority 24/7 support', 'SMS + Email alerts'].map(f => <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-surface-200)', fontSize: '0.9375rem', marginBottom: '0.75rem' }}><CheckCircle size={16} color="var(--color-primary-400)" />{f}</div>)}
              <Button className="btn-primary w-full" style={{ marginTop: '2rem', fontWeight: 700 }}>Upgrade to Pro</Button>
            </div>

            {/* Ultra */}
            <div className="glass-panel animate-fade-in delay-400" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px) scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 32px 64px rgba(0,0,0,0.5)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent-400)', marginBottom: '0.5rem' }}>Ultra</h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>$199<span style={{ fontSize: '1.125rem', color: 'var(--color-surface-500)', fontWeight: 500 }}>/mo</span></div>
              <p style={{ color: 'var(--color-surface-500)', marginBottom: '2rem', fontSize: '0.9375rem' }}>Enterprise-grade suite for large fleets.</p>
              {['Full enterprise suite', 'Custom API integrations', 'Dedicated fleet access', 'SLA guarantee & reporting', 'Dedicated account manager'].map(f => <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-surface-300)', fontSize: '0.9375rem', marginBottom: '0.75rem' }}><CheckCircle size={16} color="var(--color-accent-400)" />{f}</div>)}
              <Button className="btn-outline w-full" style={{ marginTop: '2rem', borderColor: 'var(--color-accent-400)', color: 'var(--color-accent-400)' }}>Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: '7rem 2.5rem', background: 'var(--color-surface-100)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-primary-400)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Reach Out</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Get In Touch</h2>
          <p style={{ color: 'var(--color-surface-400)', fontSize: '1.125rem', marginBottom: '3rem', lineHeight: 1.8 }}>
            Have a question or want to partner with LastMile? Our team responds within 24 hours.
          </p>
          <form className="glass-panel" style={{ padding: '3rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            onSubmit={e => { e.preventDefault(); alert("Thanks! We'll be in touch soon."); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[
                { label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                { label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
              ].map(({ label, type, placeholder }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-400)', marginBottom: '0.625rem', letterSpacing: '0.02em' }}>{label}</label>
                  <input type={type} required placeholder={placeholder}
                    style={{ width: '100%', padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.875rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--color-primary-500)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-400)', marginBottom: '0.625rem' }}>Message</label>
              <textarea required rows={5} placeholder="Tell us how we can help…"
                style={{ width: '100%', padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.875rem', color: 'white', fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary-500)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
            </div>
            <Button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.125rem', fontSize: '1.0625rem', fontWeight: 700, marginTop: '0.5rem' }}>
              Send Message <ArrowRight size={18} />
            </Button>
          </form>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--color-surface-50)', padding: '3rem 2.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
          <Truck size={20} color="var(--color-primary-400)" />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>LastMile</span>
        </div>
        <p style={{ color: 'var(--color-surface-500)', fontSize: '0.9375rem', margin: 0 }}>© {new Date().getFullYear()} LastMile Delivery. All rights reserved.</p>
      </footer>

    </div>
  );
};
