import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
}) => {
  const colorStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)' },
    success: { backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-600)' },
    warning: { backgroundColor: 'var(--color-warning-50)', color: 'var(--color-warning-600)' },
    danger: { backgroundColor: 'var(--color-danger-50)', color: 'var(--color-danger-600)' },
  };

  return (
    <div className="card" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-surface-500)' }}>{title}</h3>
        <div style={{ padding: '0.5rem', borderRadius: '0.5rem', ...colorStyles[color] }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-surface-950)' }}>{value}</p>
        {trend && (
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 500, color: trend.isPositive ? 'var(--color-success-600)' : 'var(--color-danger-600)' }}>
            {trend.isPositive ? <TrendingUp size={14} style={{ marginRight: '0.25rem' }} /> : <TrendingDown size={14} style={{ marginRight: '0.25rem' }} />}
            {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
};
