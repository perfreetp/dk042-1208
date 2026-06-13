import { cn, getStatusText } from '../utils';

interface StatusBadgeProps {
  status: string;
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
  showDot?: boolean;
}

function getDotColor(status: string): string {
  const colors: Record<string, string> = {
    success: 'bg-emerald-400',
    failed: 'bg-red-400',
    running: 'bg-blue-400',
    pending: 'bg-gray-400',
    healthy: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
    pending_approval: 'bg-amber-400',
    approved: 'bg-blue-400',
    deploying: 'bg-cyan-400',
    completed: 'bg-emerald-400',
    rollback: 'bg-orange-400',
    rejected: 'bg-red-400',
    backlog: 'bg-gray-400',
    in_progress: 'bg-blue-400',
    testing: 'bg-amber-400',
    done: 'bg-emerald-400',
    closed: 'bg-gray-400',
  };
  return colors[status] || 'bg-gray-400';
}

function getTextColor(status: string): string {
  const colors: Record<string, string> = {
    success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    failed: 'text-red-400 bg-red-400/10 border-red-400/20',
    running: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    pending: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    healthy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    error: 'text-red-400 bg-red-400/10 border-red-400/20',
    pending_approval: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    approved: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    deploying: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    rollback: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
    backlog: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    testing: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    done: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    closed: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
}

export function StatusBadge({ status, text, size = 'md', className, showDot = true }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  const displayText = text || getStatusText(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-medium border',
        getTextColor(status),
        sizeClasses,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            getDotColor(status),
            status === 'running' || status === 'deploying' ? 'animate-pulse' : ''
          )}
        />
      )}
      {displayText}
    </span>
  );
}
