import React from 'react';

export const SkeletonLine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton h-4 w-full ${className}`}></div>
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg border border-surface-200 p-6 space-y-4">
    <div className="skeleton h-10 w-10 rounded-full"></div>
    <SkeletonLine className="w-1/2" />
    <SkeletonLine className="w-3/4" />
  </div>
);

export const SkeletonTable: React.FC<{ columns: number; rows: number }> = ({ columns, rows }) => (
  <div className="overflow-hidden rounded-lg border border-surface-200 bg-white">
    <div className="bg-surface-50 grid px-6 py-3 border-b border-surface-200" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="skeleton h-4 w-20"></div>
      ))}
    </div>
    <div className="divide-y divide-surface-200">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid px-6 py-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="skeleton h-4 w-24"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);
