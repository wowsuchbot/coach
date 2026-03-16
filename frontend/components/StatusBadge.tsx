'use client';

type TaskStatus = 'pending' | 'in_progress' | 'blocked' | 'done';
type Priority = 1 | 2 | 3;

interface StatusBadgeProps {
  status: TaskStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

interface PriorityBadgeProps {
  priority: Priority | number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig: Record<TaskStatus, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-yellow-300', bg: 'bg-yellow-500', label: 'Pending' },
  in_progress: { color: 'text-blue-300', bg: 'bg-blue-500', label: 'In Progress' },
  blocked: { color: 'text-red-300', bg: 'bg-red-500', label: 'Blocked' },
  done: { color: 'text-green-300', bg: 'bg-green-500', label: 'Done' },
};

const priorityConfig: Record<number, { color: string; label: string }> = {
  1: { color: 'text-red-400', label: 'high' },
  2: { color: 'text-yellow-400', label: 'medium' },
  3: { color: 'text-gray-400', label: 'low' },
};

export function StatusBadge({ status, showLabel = true, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-3 w-3';

  return (
    <span 
      className="flex items-center gap-1.5"
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      <span className={`${dotSize} rounded-full ${config.bg}`} aria-hidden="true" />
      {showLabel && (
        <span className={`${config.color} text-xs uppercase`}>
          {config.label}
        </span>
      )}
      <span className="sr-only">{config.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority, showLabel = true, size = 'sm' }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig[2];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span 
      className={`inline-flex items-center ${textSize} uppercase ${config.color}`}
      aria-label={`Priority: ${config.label}`}
    >
      {showLabel && config.label}
      <span className="sr-only">{config.label}</span>
    </span>
  );
}
