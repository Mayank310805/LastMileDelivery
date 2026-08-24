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
      <div className="empty-state">
        <Inbox size={48} className="text-surface-300 mx-auto mb-4" />
        <p className="text-surface-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-surface-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={col.sortable ? 'cursor-pointer select-none hover:bg-surface-100 transition-colors' : ''}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center gap-1">
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
              className={onRowClick ? 'clickable cursor-pointer hover:bg-surface-50 transition-colors' : ''}
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
