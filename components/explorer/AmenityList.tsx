'use client';

import { ArrowUpRight } from 'lucide-react';
import { AMENITIES } from '@/lib/data/amenities';
import { useExplorerStore } from '@/lib/store';

export default function AmenityList() {
  const focusAmenity = useExplorerStore((state) => state.focusAmenity);
  const activeAmenity = useExplorerStore((state) => state.activeAmenity);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-sans text-[13px] font-medium tracking-normal">Around the neighbourhood</h3>
        <span className="numeric text-[11px] text-ink/70">{String(AMENITIES.length).padStart(2, '0')} places</span>
      </div>
      <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
        {AMENITIES.map((amenity, index) => {
          const active = activeAmenity === amenity.id;
          return (
            <li key={amenity.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  focusAmenity(amenity.id);
                  document.getElementById('master-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`group flex w-full items-start gap-3 rounded-xl px-2 py-4 text-left transition-colors ${active ? 'bg-lime/35' : 'hover:bg-white/65'}`}
              >
                <span className="numeric pt-1 text-[10px] text-ink/70">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-ink">{amenity.name}</span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-ink/70">{amenity.summary}</span>
                </span>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${active ? 'bg-ink text-bone' : 'border border-ink/15 text-ink/70 group-hover:bg-ink group-hover:text-bone'}`}><ArrowUpRight size={14} aria-hidden="true" /></span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
