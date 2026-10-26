import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending Approval',
    bg: 'bg-amber-50 text-amber-900 border-amber-200/80',
    dot: 'bg-amber-600',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-emerald-50 text-emerald-900 border-emerald-200/80',
    dot: 'bg-emerald-700',
    icon: CheckCircle2,
  },
  completed: {
    label: 'Completed',
    bg: 'bg-stone-100 text-stone-800 border-stone-300',
    dot: 'bg-stone-600',
    icon: CheckCheck,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-stone-50 text-stone-500 border-stone-200',
    dot: 'bg-stone-400',
    icon: XCircle,
  },
  rejected: {
    label: 'Declined',
    bg: 'bg-rose-50 text-rose-900 border-rose-200',
    dot: 'bg-rose-600',
    icon: AlertCircle,
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.pending;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${config.bg} ${
        isSmall ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } tracking-tight`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="font-semibold">{config.label}</span>
    </span>
  );
}
