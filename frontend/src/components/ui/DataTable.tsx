import React from 'react';
import { ChevronUp, ChevronDown, Inbox } from 'lucide-react';
import { SkeletonTable } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
  emptyMessage = 'No data found'
}: DataTableProps<T>) {
  if (isLoading) {
    return <SkeletonTable columns={columns.length} rows={5} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="panel flex-col items-center justify-center text-center" style={{ padding: '3rem 1rem' }}>
        <Inbox size={48} color="var(--color-surface-300)" style={{ margin: '0 auto 1rem auto' }} />
        <p className="text-sm" style={{ color: 'var(--color-surface-500)' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0, 0, 0, 0.2)' }}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick && onRowClick(item)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((col) => (
                <td key={`${item.id}-${col.key}`}>
                  {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
