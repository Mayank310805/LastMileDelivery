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
    <div className="card hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-default">
      <div className="flex items-center gap-4">
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', ...colorStyles[color] }}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-surface-900">{value}</p>
            {trend && (
              <span className={`flex items-center text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                {trend.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
