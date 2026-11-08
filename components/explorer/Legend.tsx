'use client';

import { useExplorerStore } from '@/lib/store';
import StatusBadge from '@/components/ui/StatusBadge';

const STATUS_MEANING: Record<string, string> = {
  available: 'Solid green',
  booked: 'Amber diagonal hatch',
  sold: 'Red cross-hatch',
};

export default function Legend() {
  const statuses = ['available', 'booked', 'sold'] as const;

  return (
    <div className="pointer-events-auto rounded-sm border border-ink/12 bg-bone/92 px-4 py-3 backdrop-blur-md">
      <div className="eyebrow text-ink/45">Parcel status</div>
      <ul className="mt-2.5 space-y-1.5">
        {statuses.map((status) => (
          <li key={status} className="flex items-center gap-3">
            <StatusBadge status={status} />
            <span className="text-[10.5px] text-ink/45">{STATUS_MEANING[status]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 max-w-[26ch] text-[10px] leading-snug text-ink/40">
        Colour is never the only cue: each status also carries a pattern and a word.
      </p>
    </div>
  );
}
