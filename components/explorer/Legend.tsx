'use client';

import StatusBadge from '@/components/ui/StatusBadge';

export default function Legend() {
  return (
    <div className="pointer-events-auto rounded-full border border-white/60 bg-bone/95 px-4 py-3 shadow-[0_6px_24px_-16px_rgba(22,44,37,0.2)]">
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Plot availability legend">
        {(['available', 'booked', 'sold'] as const).map((status) => <li key={status}><StatusBadge status={status} className="text-[9px]" /></li>)}
      </ul>
    </div>
  );
}
