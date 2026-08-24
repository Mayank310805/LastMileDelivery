import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--color-surface-50)' }}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <div className="app-main">
        <header className="app-header" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-surface-200)', padding: '0 1.5rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ display: sidebarOpen ? 'none' : 'block', border: 'none', background: 'none', cursor: 'pointer', padding: '0.25rem' }}
              className="menu-button lg-hidden"
              aria-label="Open menu"
            >
              <Menu size={24} color="var(--color-surface-600)" />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-surface-600)', fontSize: '0.875rem', fontWeight: 500 }}>
              <ShieldCheck size={18} color="var(--color-primary-600)" />
              <span style={{ textTransform: 'capitalize' }}>{user?.role ? `${user.role.toLowerCase()} workspace` : 'Secure workspace'}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-surface-200)', background: 'var(--color-surface-50)', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', color: 'var(--color-surface-500)', fontSize: '0.875rem', width: '250px' }} className="hidden sm-flex">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search orders, agents, pincodes..." 
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--color-surface-900)' }} 
              />
            </div>
            
            <div style={{ height: '2rem', width: '2rem', borderRadius: '9999px', background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, border: '1px solid var(--color-primary-200)' }}>
              {user?.name?.charAt(0).toUpperCase() || 'L'}
            </div>
          </div>
        </header>

        <main className="app-content animate-fade-in" style={{ padding: '1.5rem', overflowY: 'auto', height: 'calc(100vh - 4rem)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
