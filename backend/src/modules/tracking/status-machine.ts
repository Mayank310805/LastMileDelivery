import { AppError } from '../../utils/AppError';

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  CREATED: ['ASSIGNED'],
  ASSIGNED: ['PICKED_UP', 'FAILED'],
  PICKED_UP: ['IN_TRANSIT', 'FAILED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  FAILED: ['RESCHEDULED'],
  RESCHEDULED: ['ASSIGNED'],
  DELIVERED: [], // terminal
};

export function validateTransition(currentStatus: string, newStatus: string, isOverride: boolean): void {
  if (isOverride) return;
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(409, 'INVALID_STATUS_TRANSITION', `Cannot transition from ${currentStatus} to ${newStatus}`);
  }
}
