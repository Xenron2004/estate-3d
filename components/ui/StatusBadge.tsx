import type { PlotStatus } from '@/lib/types';

const PATTERNS: Record<PlotStatus, string> = {
  available: 'rgba(79,127,82,0.55)',
  booked:
    'repeating-linear-gradient(45deg, rgba(185,130,44,0.85) 0 1.5px, rgba(185,130,44,0.25) 1.5px 4px)',
  sold:
    'repeating-linear-gradient(45deg, rgba(156,74,60,0.85) 0 1.5px, rgba(156,74,60,0.25) 1.5px 4px), repeating-linear-gradient(-45deg, rgba(156,74,60,0.85) 0 1.5px, rgba(156,74,60,0.25) 1.5px 4px)',
};

const LABELS: Record<PlotStatus, string> = {
  available: 'Available',
  booked: 'Booked',
  sold: 'Sold',
};

const TEXT: Record<PlotStatus, string> = {
  available: 'text-available',
  booked: 'text-booked',
  sold: 'text-sold',
};

export default function StatusBadge({
  status,
  className = '',
}: {
  status: PlotStatus;
  className?: string;
}) {
  return (
    <span className={`status-chip ${TEXT[status]} ${className}`}>
      <span
        aria-hidden="true"
        className="inline-block h-2.5 w-2.5 rounded-[1px] border border-current"
        style={{ background: PATTERNS[status] }}
      />
      {LABELS[status]}
    </span>
  );
}
