import type { CheckStatus } from '../types';

const styles: Record<CheckStatus, { bg: string; text: string; label: string }> =
  {
    good: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      label: 'Good',
    },
    'needs-work': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      label: 'Needs work',
    },
    missing: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      label: 'Missing',
    },
    error: {
      bg: 'bg-stone-100',
      text: 'text-stone-500',
      label: 'Error',
    },
  };

const icons: Record<CheckStatus, string> = {
  good: '\u2713',
  'needs-work': '\u26A0',
  missing: '\u2717',
  error: '?',
};

interface StatusBadgeProps {
  status: CheckStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span>{icons[status]}</span>
      {style.label}
    </span>
  );
}
