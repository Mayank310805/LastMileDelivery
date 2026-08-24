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
    <div className={`app-sidebar ${isOpen ? 'open' : ''}`} style={{ backgroundColor: 'var(--color-surface-900)', borderRight: '1px solid var(--color-surface-800)', width: 'var(--sidebar-width)' }}>
      <Link to="/" style={{ height: '4rem', display: 'flex', alignItems: 'center', padding: '0 1.25rem', borderBottom: '1px solid var(--color-surface-800)', textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
          <div style={{ height: '2rem', width: '2rem', borderRadius: '0.375rem', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={18} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'white' }}>LastMile</span>
          </div>
        </div>
      </Link>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/admin' || link.path === '/agent' || link.path === '/dashboard' || link.path === '/orders'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isActive ? 'white' : 'var(--color-surface-400)',
              backgroundColor: isActive ? 'var(--color-primary-600)' : 'transparent',
              transition: 'all 0.2s'
            })}
          >
            <link.icon size={18} />
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ margin: '0 0.75rem 0.75rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-surface-800)', border: '1px solid var(--color-surface-700)' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-surface-400)', letterSpacing: '0.05em' }}>Operations pulse</p>
        <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-surface-900)', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-surface-700)' }}>
            <span style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: 'white' }}>98%</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-surface-400)' }}>SLA</span>
          </div>
          <div style={{ backgroundColor: 'var(--color-surface-900)', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-surface-700)' }}>
            <span style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: 'white' }}>12m</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-surface-400)' }}>Avg assign</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--color-surface-800)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '9999px', backgroundColor: 'var(--color-surface-700)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-surface-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-surface-400)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-surface-400)'}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
