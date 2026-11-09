'use client';

import { ArrowUpRight, Home, MousePointer2, X } from 'lucide-react';
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
      <div className="rounded-[20px] border border-ink/8 bg-white/70 px-6 py-9 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime text-ink"><MousePointer2 size={19} strokeWidth={1.5} aria-hidden="true" /></span>
        <p className="mt-5 font-display text-[27px] leading-tight text-ink">Your story starts here.</p>
        <p className="mx-auto mt-2.5 max-w-[29ch] text-[13px] leading-relaxed text-ink/70">
          Select a plot to discover its dimensions, outlook and possibilities.
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
    <div className={compact ? '' : 'rounded-[20px] border border-ink/8 bg-white/80 p-5 sm:p-6'}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="numeric font-display text-[42px] leading-none tracking-[-0.05em] text-ink">{plot.id}</span>
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
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <dl className="mt-6 divide-y divide-ink/8 border-y border-ink/10">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-5 py-3">
            <dt className="text-[11.5px] text-ink/70">{row.label}</dt>
            <dd className="numeric text-right text-[13px] text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[13px] leading-relaxed text-ink/70">{plot.description}</p>

      <div className="mt-5">
        <div className="eyebrow text-ink/70">Walking distance</div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {[
            ['Central park', plot.distances.park],
            ['Play court', plot.distances.play],
            ['Clubhouse', plot.distances.club],
            ['Main gate', plot.distances.entrance],
          ].map(([label, value]) => (
            <div key={label as string} className="flex items-baseline justify-between gap-2">
              <span className="text-[11.5px] text-ink/70">{label as string}</span>
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
            className="flex min-h-12 items-center justify-between gap-3 rounded-full border border-ink/15 px-4 py-3 text-[12px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone"
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
          className="flex min-h-12 items-center justify-between gap-3 rounded-full bg-ink px-5 py-3 text-[12px] text-bone transition-colors hover:bg-ink-soft"
        >
          Enquire about {plot.id}
          <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>

      {plot.status !== 'available' && (
        <p className="mt-4 text-[11px] leading-relaxed text-ink/70">
          {plot.status === 'booked'
            ? 'This parcel is currently reserved. Enquiries are added to a waiting list for the next release.'
            : 'This parcel has been transferred. Comparable plots in the same row remain open.'}
        </p>
      )}
    </div>
  );
}
