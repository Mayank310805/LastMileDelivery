import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, ArrowRight, Zap, MapPin, Bell, CheckCircle, 
  Menu, X, User, Package, BarChart, Star, Plus, Minus, 
  Navigation, Check, Users, ShieldCheck, Mail, Map, Moon, Sun
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const Counter = ({ end, suffix = '', label, decimals = 0 }: { end: number, suffix?: string, label: string, decimals?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = end / steps;
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, stepTime);
        
        observer.disconnect();
      }
    });
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [end]);
  
  return (
    <div className="scroll-reveal" ref={ref} style={{ padding: '2rem', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-surface-200)', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary-600)', marginBottom: '0.5rem', lineHeight: 1 }}>
        {count.toFixed(decimals)}{suffix}
      </div>
      <div style={{ color: 'var(--color-surface-500)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--color-surface-200)', padding: '1.5rem 0' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', color: 'var(--color-surface-900)', fontSize: '1.125rem', fontWeight: 600 }}
      >
        {question}
        {isOpen ? <Minus size={20} color="var(--color-primary-600)" /> : <Plus size={20} color="var(--color-surface-500)" />}
      </button>
      {isOpen && (
        <div style={{ marginTop: '1rem', color: 'var(--color-surface-700)', lineHeight: 1.6 }}>
          {answer}
        </div>
      )}
    </div>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Membership', href: '#membership' },
    { name: 'Contact', href: '#contact' }
  ];

  const faqs = [
    { question: "How does the pricing work?", answer: "We offer flexible pricing tiers based on your monthly delivery volume. You can choose to be billed monthly or annually, with annual plans offering a 20% discount." },
    { question: "Can I track deliveries in real-time?", answer: "Yes, all plans include real-time GPS tracking. Your customers will receive a live tracking link via SMS or email once the driver starts the route." },
    { question: "Do you integrate with my existing tools?", answer: "We provide seamless integrations with major e-commerce platforms like Shopify, WooCommerce, and Magento, as well as an open API for custom integrations on our Ultra plan." },
    { question: "How does the auto-assign feature work?", answer: "Our intelligent algorithm matches orders to the nearest available driver based on their current capacity, location, and the package's destination, optimizing the entire fleet's route." },
    { question: "Is there a limit on the number of drivers I can add?", answer: "Our Pro plan includes up to 50 driver accounts, while the Ultra plan provides unlimited driver seats for enterprise fleets." },
    { question: "What kind of support do you provide?", answer: "Free and Pro plans include standard email support during business hours. Ultra plans get 24/7 priority support and a dedicated account manager." }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-surface-50)', color: 'var(--color-surface-900)', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-buttons { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
      
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav style={{ 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: isScrolled ? 'var(--color-bg-white)' : 'transparent', 
        borderBottom: isScrolled ? '1px solid var(--color-surface-200)' : '1px solid transparent', 
        position: 'fixed', 
        width: '100%', 
        top: 0, 
        zIndex: 100, 
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={24} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-surface-900)', letterSpacing: '-0.02em' }}>LastMile</span>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="nav-desktop-links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} style={{
              color: 'var(--color-surface-600)',
              textDecoration: 'none',
              fontSize: '0.9375rem',
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--color-primary-600)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--color-surface-600)')}>
              {link.name}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="nav-desktop-buttons">
          <button 
            onClick={toggleTheme} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-surface-600)' }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Button variant="outline" onClick={() => navigate('/login')} style={{ fontSize: '0.9375rem' }}>Log In</Button>
          <Button className="btn-primary" onClick={() => navigate('/register')} style={{ fontSize: '0.9375rem' }}>Sign Up</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="nav-mobile-btn" style={{ display: 'none', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--color-surface-600)' }}
          >
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-surface-900)', cursor: 'pointer' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div style={{ position: 'fixed', top: '4.5rem', left: 0, right: 0, background: 'var(--color-bg-white)', padding: '1.5rem', borderBottom: '1px solid var(--color-surface-200)', zIndex: 99, display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} style={{
              color: 'var(--color-surface-800)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 600
            }}>
              {link.name}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} style={{ width: '100%' }}>Log In</Button>
            <Button className="btn-primary" onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }} style={{ width: '100%' }}>Sign Up</Button>
          </div>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section id="home" className="scroll-reveal" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative', 
        overflow: 'hidden', 
        paddingTop: '6rem',
        background: theme === 'light' ? 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)' : 'var(--color-surface-100)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', width: '100%' }}>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '2rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary-600)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-700)' }}>LastMile Delivery Platform</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-surface-900)', letterSpacing: '-0.02em' }}>
              Move Every Delivery With <span style={{ color: 'var(--color-primary-600)' }}>Confidence</span>
            </h1>
            
            <p style={{ fontSize: '1.125rem', color: 'var(--color-surface-600)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '36rem' }}>
              LastMile puts businesses in complete control of their logistics operations. Automate driver dispatch, offer real-time tracking, and deliver exceptional experiences from checkout to doorstep.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.0625rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/register')}>
                Start Delivering <ArrowRight size={18} />
              </Button>
              <Button variant="outline" style={{ padding: '1rem 2rem', fontSize: '1.0625rem', fontWeight: 600 }} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Platform
              </Button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-surface-200)', position: 'relative' }}>
              <img src="/delivery-hero.png" alt="Courier handing package" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
              
              {/* Floating stat cards */}
              <div style={{ position: 'absolute', bottom: '2rem', left: '-1rem', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem', border: '1px solid var(--color-surface-200)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={20} color="var(--color-primary-600)" />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-surface-500)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Deliveries Today</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-surface-900)', margin: 0 }}>2,841</p>
              </div>
              
              <div style={{ position: 'absolute', top: '2rem', right: '-1rem', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem', border: '1px solid var(--color-surface-200)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={20} color="var(--color-success-500)" />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-surface-500)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>On-time rate</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-surface-900)', margin: 0 }}>99.9%</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section id="about" style={{ padding: '6rem 2rem', background: 'var(--color-bg-white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '1rem' }}>How It Works</h2>
            <p style={{ color: 'var(--color-surface-600)', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto' }}>
              A seamless flow from the moment an order is placed to the final successful delivery.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {[
              { num: 1, icon: Package, title: 'Create Delivery Request', desc: 'Businesses easily create delivery requests manually via the dashboard or automate the process using our open API integration.', image: '/step_create.png' },
              { num: 2, icon: Navigation, title: 'Smart Auto-Assign', desc: 'Our intelligent routing engine automatically dispatches the most optimal driver based on location, current workload, and vehicle capacity.', image: '/step_assign.png' },
              { num: 3, icon: MapPin, title: 'Real-Time Tracking', desc: 'Customers receive an SMS or email link to track their delivery on a live map, complete with accurate ETAs and driver details.', image: '/step_track.png' },
              { num: 4, icon: CheckCircle, title: 'Proof of Delivery', desc: 'Drivers complete the delivery by collecting a signature, taking a photo, or scanning a barcode, providing instant confirmation.', image: '/step_deliver.png' }
            ].map(({ num, title, desc, image }, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={title} className="scroll-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                  <div style={{ order: isEven ? 1 : 2 }}>
                    <img src={image} alt={title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-surface-200)', objectFit: 'cover', aspectRatio: '16/9' }} />
                  </div>
                  <div style={{ order: isEven ? 2 : 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-primary-200)', fontSize: '1.25rem', fontWeight: 'bold' }}>
                      {num}
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>{title}</h3>
                    <p style={{ color: 'var(--color-surface-600)', fontSize: '1.125rem', lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Built for Every Delivery (Roles) ────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--color-surface-100)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '1rem' }}>Built for Every Delivery Role</h2>
            <p style={{ color: 'var(--color-surface-600)', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto' }}>
              Tailored interfaces and powerful tools designed specifically for each part of the logistics chain.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              { icon: User, color: 'var(--color-primary-600)', title: 'Customer', desc: 'Track deliveries in real-time with precise ETAs and status notifications.', image: '/role_customer.png' },
              { icon: Truck, color: 'var(--color-accent-500)', title: 'Driver', desc: 'Get optimized routes, manage workload, and collect proof of delivery.', image: '/role_driver.png' },
              { icon: ShieldCheck, color: '#8B5CF6', title: 'Administrator', desc: 'Monitor your operations, manage driver fleets, and analyze performance.', image: '/role_admin.png' }
            ].map(({ icon: Icon, color, title, desc, image }) => (
              <div key={title} className="card scroll-reveal" style={{ background: 'var(--color-bg-white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-surface-200)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                <img src={image} alt={title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--color-surface-200)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} color={color} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)' }}>{title}</h3>
                </div>
                <p style={{ color: 'var(--color-surface-600)', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '2rem' }}>{desc}</p>
                <Button variant="outline" style={{ width: '100%', borderColor: 'var(--color-surface-300)', color: 'var(--color-surface-700)' }}>Learn More</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics Counter ─────────────────────────────────── */}
      <section className="scroll-reveal" style={{ padding: '5rem 2rem', background: 'var(--color-primary-600)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { end: 10, suffix: 'K+', label: 'Deliveries Managed' },
              { end: 99.9, suffix: '%', label: 'Platform Availability', decimals: 1 },
              { end: 500, suffix: '+', label: 'Active Drivers' },
              { end: 25, suffix: '+', label: 'Cities Served' }
            ].map((stat, i) => (
              <Counter key={i} end={stat.end} suffix={stat.suffix} label={stat.label} decimals={stat.decimals} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services / Features ────────────────────────────────── */}
      <section id="services" style={{ padding: '6rem 2rem', background: 'var(--color-bg-white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '1rem' }}>Everything You Need to Scale</h2>
            <p style={{ color: 'var(--color-surface-600)', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto' }}>
              Our platform offers a comprehensive suite of features designed to make local logistics effortless.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Navigation, title: 'Smart Route Assignment', desc: 'Automatically assign orders to the nearest available driver.' },
              { icon: Zap, title: 'Dynamic Pricing', desc: 'Calculate accurate rates instantly based on distance, time, and package size.' },
              { icon: MapPin, title: 'Real-Time Tracking', desc: 'Provide live map tracking links to your customers for precise ETAs.' },
              { icon: Users, title: 'Driver Management', desc: 'Onboard drivers, manage their schedules, and track their performance.' },
              { icon: BarChart, title: 'Delivery Analytics', desc: 'Gain insights into delivery times, success rates, and operational costs.' },
              { icon: Bell, title: 'Notifications', desc: 'Automated SMS and email alerts keep everyone in the loop.' }
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="scroll-reveal" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--color-surface-200)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-50)' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} color="var(--color-primary-600)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-surface-900)', margin: 0 }}>{title}</h3>
                <p style={{ color: 'var(--color-surface-600)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ───────────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--color-surface-100)', borderTop: '1px solid var(--color-surface-200)', borderBottom: '1px solid var(--color-surface-200)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '1rem' }}>Trusted by growing delivery teams</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { quote: "LastMile has completely transformed how we handle our local logistics. Our customers love the real-time tracking, and our admin overhead has dropped by 40%.", author: "Rajiv Sharma", role: "Operations Manager, SwiftCourier", avatar: "/avatar_1.png" },
              { quote: "The auto-assignment feature alone is worth the investment. It makes sure our drivers aren't crisscrossing the city unnecessarily.", author: "Priya Patel", role: "Founder, FreshBites Delivery", avatar: "/avatar_2.png" },
              { quote: "We scaled from 10 to 50 drivers in just three months, and LastMile handled the growth seamlessly. The analytics give us total visibility.", author: "Arjun Desai", role: "CEO, MetroLogistics", avatar: "/avatar_3.png" }
            ].map((testimonial, i) => (
              <div key={i} className="scroll-reveal" style={{ background: 'var(--color-bg-white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-200)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', color: '#F59E0B' }}>
                  {[1,2,3,4,5].map(star => <Star key={star} size={20} fill="currentColor" />)}
                </div>
                <p style={{ color: 'var(--color-surface-700)', fontSize: '1.125rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem' }}>"{testimonial.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={testimonial.avatar} alt={testimonial.author} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-surface-900)', fontSize: '1.0625rem' }}>{testimonial.author}</div>
                    <div style={{ color: 'var(--color-surface-500)', fontSize: '0.9375rem' }}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing / Membership ───────────────────────────────── */}
      <section id="membership" style={{ padding: '6rem 2rem', background: 'var(--color-bg-white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '1.5rem' }}>Simple, Transparent Pricing</h2>
            
            <div style={{ display: 'inline-flex', background: 'var(--color-surface-100)', borderRadius: '999px', padding: '0.25rem', border: '1px solid var(--color-surface-200)' }}>
              <button 
                onClick={() => setBillingCycle('monthly')}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '999px', border: 'none', background: billingCycle === 'monthly' ? 'var(--color-bg-white)' : 'transparent', boxShadow: billingCycle === 'monthly' ? 'var(--shadow-sm)' : 'none', color: billingCycle === 'monthly' ? 'var(--color-surface-900)' : 'var(--color-surface-600)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9375rem', transition: 'all 0.2s' }}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '999px', border: 'none', background: billingCycle === 'annual' ? 'var(--color-bg-white)' : 'transparent', boxShadow: billingCycle === 'annual' ? 'var(--shadow-sm)' : 'none', color: billingCycle === 'annual' ? 'var(--color-surface-900)' : 'var(--color-surface-600)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9375rem', transition: 'all 0.2s' }}
              >
                Annual <span style={{ color: 'var(--color-success-600)', fontSize: '0.8125rem', marginLeft: '0.25rem' }}>Save 20%</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            
            {/* Free */}
            <div className="scroll-reveal" style={{ padding: '3rem', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-surface-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)', marginBottom: '0.5rem' }}>Free</h3>
              <p style={{ color: 'var(--color-surface-600)', marginBottom: '2rem' }}>Perfect to test the waters.</p>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '2rem' }}>
                $0<span style={{ fontSize: '1rem', color: 'var(--color-surface-500)', fontWeight: 500 }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Up to 50 deliveries/mo', 'Basic tracking links', 'Email notifications', '1 Admin account', 'Standard support'].map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-surface-700)' }}>
                    <Check size={18} color="var(--color-primary-600)" /> {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" style={{ width: '100%', padding: '0.75rem' }}>Get Started Free</Button>
            </div>

            {/* Pro */}
            <div className="scroll-reveal" style={{ padding: '3.5rem 3rem', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--color-primary-600)', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--color-primary-600)', color: '#FFFFFF', padding: '0.5rem 1.5rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.875rem' }}>
                RECOMMENDED
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)', marginBottom: '0.5rem' }}>Pro</h3>
              <p style={{ color: 'var(--color-surface-600)', marginBottom: '2rem' }}>For growing delivery businesses.</p>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '2rem' }}>
                ${billingCycle === 'monthly' ? '49' : '39'}<span style={{ fontSize: '1rem', color: 'var(--color-surface-500)', fontWeight: 500 }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Unlimited deliveries', 'Smart Auto-Assignment', 'Real-time GPS Tracking', 'Up to 50 drivers', 'SMS + Email Alerts', 'Delivery Analytics'].map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-surface-900)', fontWeight: 500 }}>
                    <Check size={18} color="var(--color-primary-600)" /> {feature}
                  </li>
                ))}
              </ul>
              <Button className="btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1.0625rem' }}>Start 14-Day Trial</Button>
            </div>

            {/* Ultra */}
            <div className="scroll-reveal" style={{ padding: '3rem', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-surface-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-surface-900)', marginBottom: '0.5rem' }}>Ultra</h3>
              <p style={{ color: 'var(--color-surface-600)', marginBottom: '2rem' }}>For large enterprise fleets.</p>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '2rem' }}>
                ${billingCycle === 'monthly' ? '199' : '159'}<span style={{ fontSize: '1rem', color: 'var(--color-surface-500)', fontWeight: 500 }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Everything in Pro', 'Unlimited drivers', 'Custom API access', 'Dedicated Account Manager', 'Custom integrations', '24/7 Priority Support'].map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-surface-700)' }}>
                    <Check size={18} color="var(--color-primary-600)" /> {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" style={{ width: '100%', padding: '0.75rem' }}>Contact Sales</Button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--color-surface-100)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--color-surface-600)', fontSize: '1.125rem' }}>Everything you need to know about the product and billing.</p>
          </div>
          <div className="scroll-reveal" style={{ background: 'var(--color-bg-white)', borderRadius: 'var(--radius-lg)', padding: '1rem 2rem', border: '1px solid var(--color-surface-200)', boxShadow: 'var(--shadow-sm)' }}>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: '6rem 2rem', background: 'var(--color-bg-white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
          <div className="scroll-reveal">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-surface-900)', marginBottom: '1rem' }}>Let's talk logistics.</h2>
            <p style={{ color: 'var(--color-surface-600)', fontSize: '1.125rem', marginBottom: '3rem', lineHeight: 1.6 }}>
              Have questions about how LastMile can streamline your delivery operations? Send us a message and our team will get back to you within 24 hours.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-600)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-surface-900)' }}>Email Us</h4>
                  <p style={{ margin: 0, color: 'var(--color-surface-600)' }}>support@lastmile.demo</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-600)' }}>
                  <Map size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-surface-900)' }}>Headquarters</h4>
                  <p style={{ margin: 0, color: 'var(--color-surface-600)' }}>123 Logistics Way, Tech Park</p>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-reveal" style={{ background: 'var(--color-surface-50)', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-surface-200)' }}>
            <form onSubmit={e => { e.preventDefault(); alert("Thanks! We'll be in touch soon."); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-700)', marginBottom: '0.5rem' }}>First Name</label>
                  <input type="text" required placeholder="John" style={{ width: '100%', padding: '0.875rem 1rem', background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)', color: 'var(--color-surface-900)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-700)', marginBottom: '0.5rem' }}>Last Name</label>
                  <input type="text" required placeholder="Doe" style={{ width: '100%', padding: '0.875rem 1rem', background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)', color: 'var(--color-surface-900)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-700)', marginBottom: '0.5rem' }}>Work Email</label>
                <input type="email" required placeholder="john@company.com" style={{ width: '100%', padding: '0.875rem 1rem', background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)', color: 'var(--color-surface-900)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-700)', marginBottom: '0.5rem' }}>How can we help?</label>
                <textarea required rows={4} placeholder="Tell us about your delivery needs..." style={{ width: '100%', padding: '0.875rem 1rem', background: 'var(--color-bg-white)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)', color: 'var(--color-surface-900)', fontSize: '1rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }} />
              </div>
              
              <Button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.0625rem', fontWeight: 600, marginTop: '0.5rem' }}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--color-surface-900)', color: '#FFFFFF', padding: '5rem 2rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} color="white" />
                </div>
                <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>LastMile</span>
              </div>
              <p style={{ color: 'var(--color-surface-400)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '16rem' }}>
                Empowering businesses with intelligent, efficient, and transparent local delivery management.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '1.25rem', color: '#FFFFFF' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Features', 'Pricing', 'Integrations', 'Changelog', 'API Docs'].map(item => (
                  <li key={item}><a href="#" style={{ color: 'var(--color-surface-400)', textDecoration: 'none', fontSize: '0.9375rem', transition: 'color 0.2s' }}>{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '1.25rem', color: '#FFFFFF' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['About Us', 'Careers', 'Blog', 'Contact', 'Partners'].map(item => (
                  <li key={item}><a href="#" style={{ color: 'var(--color-surface-400)', textDecoration: 'none', fontSize: '0.9375rem', transition: 'color 0.2s' }}>{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '1.25rem', color: '#FFFFFF' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Security'].map(item => (
                  <li key={item}><a href="#" style={{ color: 'var(--color-surface-400)', textDecoration: 'none', fontSize: '0.9375rem', transition: 'color 0.2s' }}>{item}</a></li>
                ))}
              </ul>
            </div>

          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', color: 'var(--color-surface-500)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} LastMile Delivery Inc. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" style={{ color: 'var(--color-surface-400)', textDecoration: 'none' }}>Twitter</a>
              <a href="#" style={{ color: 'var(--color-surface-400)', textDecoration: 'none' }}>LinkedIn</a>
              <a href="#" style={{ color: 'var(--color-surface-400)', textDecoration: 'none' }}>GitHub</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
