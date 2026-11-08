'use client';

import { Compass } from 'lucide-react';
import { AMENITIES } from '@/lib/data/amenities';
import { useExplorerStore } from '@/lib/store';

export default function AmenityList() {
  const focusAmenity = useExplorerStore((state) => state.focusAmenity);
  const activeAmenity = useExplorerStore((state) => state.activeAmenity);

  return (
    <div>
      <h3 className="eyebrow text-ink/55">Amenities in the model</h3>
      <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
        {AMENITIES.map((amenity) => (
          <li key={amenity.id} className="flex items-start justify-between gap-4 py-3">
            <div>
              <div className="text-[13.5px] text-ink">{amenity.name}</div>
              <div className="mt-0.5 text-[11.5px] leading-snug text-ink/50">{amenity.summary}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                focusAmenity(amenity.id);
                document
                  .getElementById('master-plan')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.12em] transition-colors ${
                activeAmenity === amenity.id
                  ? 'border-ink bg-ink text-bone'
                  : 'border-ink/15 text-ink/65 hover:border-ink hover:text-ink'
              }`}
            >
              <Compass size={12} aria-hidden="true" />
              Explore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
