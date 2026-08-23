import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <div className="app-main">
        <header className="app-header">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ display: sidebarOpen ? 'none' : 'block', border: 'none', background: 'none', cursor: 'pointer' }}
            className="menu-button"
            aria-label="Open menu"
          >
            <Menu size={24} color="var(--color-surface-500)" />
          </button>
          
          <div className="flex items-center gap-2" style={{ color: 'var(--color-surface-500)', fontSize: '0.875rem' }}>
            <ShieldCheck size={18} color="var(--color-primary-700)" />
            <span>{user?.role ? `${user.role.toLowerCase()} workspace` : 'secure workspace'}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2" style={{ border: '1px solid var(--color-surface-200)', background: 'var(--color-surface-50)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', color: 'var(--color-surface-500)', fontSize: '0.875rem' }}>
              <Search size={16} />
              <span className="hidden sm-inline">Search orders, agents, pincodes</span>
            </div>
            <div style={{ height: '2.25rem', width: '2.25rem', borderRadius: '0.5rem', background: 'var(--color-primary-100)', color: 'var(--color-primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
              {user?.name?.charAt(0).toUpperCase() || 'L'}
            </div>
          </div>
        </header>

        <main className="app-content animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
