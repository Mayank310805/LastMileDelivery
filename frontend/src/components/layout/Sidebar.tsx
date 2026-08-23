import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Users, 
  LogOut,
  Truck,
  PlusCircle,
  Map,
  CreditCard,
  Percent,
  Bell,
  Contact
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const getLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'Orders', path: '/admin/orders', icon: Package },
          { name: 'Zones', path: '/admin/zones', icon: Map },
          { name: 'Areas', path: '/admin/areas', icon: MapPin },
          { name: 'Rate Cards', path: '/admin/rate-cards', icon: CreditCard },
          { name: 'COD Config', path: '/admin/cod-configs', icon: Percent },
          { name: 'Agents', path: '/admin/agents', icon: Users },
          { name: 'Customers', path: '/admin/customers', icon: Contact },
          { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        ];
      case 'AGENT':
        return [
          { name: 'Dashboard', path: '/agent', icon: LayoutDashboard },
          { name: 'My Deliveries', path: '/agent/orders', icon: Truck },
        ];
      case 'CUSTOMER':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Create Order', path: '/orders/new', icon: PlusCircle },
          { name: 'My Orders', path: '/orders', icon: Package },
        ];
    }
  };

  const links = getLinks();

  return (
    <div className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <Link to="/" style={{ height: '4rem', display: 'flex', alignItems: 'center', padding: '0 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => (e.currentTarget.style.opacity = '0.8')} onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
          <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.5rem', background: 'var(--color-primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>LastMile</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-surface-400)' }}>Delivery command</span>
          </div>
        </div>
      </Link>

      <nav style={{ flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/admin' || link.path === '/agent' || link.path === '/dashboard' || link.path === '/orders'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <link.icon size={18} className="nav-link-icon" />
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ margin: '0 0.75rem 0.75rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '0.75rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-surface-400)' }}>Operations pulse</p>
        <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.75rem' }}>
          <div style={{ borderRadius: '0.375rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem' }}>
            <span style={{ display: 'block', fontSize: '1.125rem', fontWeight: 'bold', color: 'white' }}>98%</span>
            SLA
          </div>
          <div style={{ borderRadius: '0.375rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem' }}>
            <span style={{ display: 'block', fontSize: '1.125rem', fontWeight: 'bold', color: 'white' }}>12m</span>
            Avg assign
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0 0.5rem' }}>
          <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.375rem', background: 'var(--color-primary-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-surface-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', width: '100%', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-300)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-surface-300)'; }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
