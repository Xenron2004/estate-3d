'use client';

import { ArrowUpRight, Home, X } from 'lucide-react';
import { useExplorerStore } from '@/lib/store';
import StatusBadge from '@/components/ui/StatusBadge';
import { distanceLabel, dimensions, formatINR, formatINRFull, formatSqft, feet } from '@/lib/format';

export default function PlotDetails({ compact = false }: { compact?: boolean }) {
  const selectedId = useExplorerStore((state) => state.selectedId);
  const plots = useExplorerStore((state) => state.plots);
  const clearSelection = useExplorerStore((state) => state.clearSelection);
  const setHouseStyle = useExplorerStore((state) => state.setHouseStyle);
  const houseStyle = useExplorerStore((state) => state.houseStyle);
  const setEnquiryPlot = useExplorerStore((state) => state.setEnquiryPlot);

  const plot = plots.find((item) => item.id === selectedId);

  if (!plot) {
    return (
      <div className="rounded-sm border border-dashed border-ink/20 px-5 py-8 text-center">
        <p className="font-display text-[19px] text-ink/75">No parcel selected</p>
        <p className="mx-auto mt-2 max-w-[30ch] text-[12.5px] leading-relaxed text-ink/50">
          Tap a parcel in the 3D model, or pick one from the inventory below — both stay in sync.
        </p>
      </div>
    );
  }

  const rows: { label: string; value: string }[] = [
    { label: 'Plot area', value: `${formatSqft(plot.areaSqft)} · ${Math.round(plot.areaSqm)} m²` },
    { label: 'Dimensions', value: `${dimensions(plot)} · ${feet(plot.width)} × ${feet(plot.depth)}` },
    {
      label: 'Facing',
      value: `${plot.facing.charAt(0).toUpperCase()}${plot.facing.slice(1)}-facing${
        plot.secondaryFrontage ? ` + ${plot.secondaryFrontage} frontage` : ''
      }`,
    },
    { label: 'Road access', value: `${plot.roadName} · ${feet(plot.roadWidthM)} wide` },
    { label: 'Price', value: formatINR(plot.price) },
    { label: 'Rate', value: `${formatINRFull(plot.pricePerSqft)} / sq ft` },
  ];

  return (
    <div className={compact ? '' : 'rounded-sm border border-ink/12 bg-bone'}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="numeric font-display text-[30px] leading-none text-ink">{plot.id}</span>
            <StatusBadge status={plot.status} />
          </div>
          {plot.premium && (
            <p className="eyebrow mt-2 text-bronze">{plot.premium}</p>
          )}
        </div>
        <button
          type="button"
          onClick={clearSelection}
          aria-label="Clear selection"
          className="rounded-sm p-1 text-ink/40 transition-colors hover:text-ink"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-[11.5px] text-ink/50">{row.label}</dt>
            <dd className="numeric text-right text-[13px] text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[13px] leading-relaxed text-ink/65">{plot.description}</p>

      <div className="mt-5">
        <div className="eyebrow text-ink/45">Walking distance</div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {[
            ['Central park', plot.distances.park],
            ['Play court', plot.distances.play],
            ['Clubhouse', plot.distances.club],
            ['Main gate', plot.distances.entrance],
          ].map(([label, value]) => (
            <div key={label as string} className="flex items-baseline justify-between gap-2">
              <span className="text-[11.5px] text-ink/50">{label as string}</span>
              <span className="numeric text-[11.5px] text-ink/75">{distanceLabel(value as number)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {plot.status === 'available' && (
          <button
            type="button"
            onClick={() => setHouseStyle(houseStyle === 'none' ? 'single' : houseStyle === 'single' ? 'double' : 'none')}
            className="flex items-center justify-between gap-3 rounded-sm border border-ink/20 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone"
          >
            <span className="flex items-center gap-2">
              <Home size={14} aria-hidden="true" />
              {houseStyle === 'none'
                ? 'Visualize your future home'
                : houseStyle === 'single'
                  ? 'Concept: one floor'
                  : 'Concept: two floors'}
            </span>
            <span className="text-[10px] opacity-60">
              {houseStyle === 'none' ? 'Place' : houseStyle === 'single' ? 'Two floors' : 'Remove'}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setEnquiryPlot(plot.id);
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="flex items-center justify-between gap-3 rounded-sm bg-ink px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-bronze"
        >
          Enquire about {plot.id}
          <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>

      {plot.status !== 'available' && (
        <p className="mt-4 text-[11px] leading-relaxed text-ink/45">
          {plot.status === 'booked'
            ? 'This parcel is currently reserved. Enquiries are added to a waiting list for the next release.'
            : 'This parcel has been transferred. Comparable plots in the same row remain open.'}
        </p>
      )}
    </div>
  );
}
