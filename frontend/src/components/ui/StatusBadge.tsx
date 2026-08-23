import React from 'react';

type Status = 'CREATED' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'RESCHEDULED';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { color: string; label: string }> = {
  CREATED: { color: 'badge-info', label: 'Created' },
  ASSIGNED: { color: 'badge-info', label: 'Assigned' },
  PICKED_UP: { color: 'badge-info', label: 'Picked Up' },
  IN_TRANSIT: { color: 'badge-info', label: 'In Transit' },
  OUT_FOR_DELIVERY: { color: 'badge-warning', label: 'Out for Delivery' },
  DELIVERED: { color: 'badge-success', label: 'Delivered' },
  FAILED: { color: 'badge-danger', label: 'Failed' },
  RESCHEDULED: { color: 'badge-warning', label: 'Rescheduled' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.CREATED;

  return (
    <span className={`badge ${config.color}`}>
      {config.label}
    </span>
  );
};
