'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, Crosshair } from 'lucide-react';
import { useExplorerStore } from '@/lib/store';
import StatusBadge from '@/components/ui/StatusBadge';
import { dimensions, formatINR, formatSqft } from '@/lib/format';

export default function InventoryList({ limit }: { limit?: number }) {
  const plots = useExplorerStore((state) => state.plots);
  const filteredIds = useExplorerStore((state) => state.filteredIds);
  const selectedId = useExplorerStore((state) => state.selectedId);
  const focusPlot = useExplorerStore((state) => state.focusPlot);
  const setEnquiryPlot = useExplorerStore((state) => state.setEnquiryPlot);
  const resetFilters = useExplorerStore((state) => state.resetFilters);
  const compact = Boolean(limit);
  const [visibleCount, setVisibleCount] = useState(8);
  useEffect(() => setVisibleCount(8), [filteredIds]);
  const matching = useMemo(() => {
    const allowed = new Set(filteredIds);
    return plots.filter((plot) => allowed.has(plot.id));
  }, [plots, filteredIds]);
  const rows = matching.slice(0, limit ?? visibleCount);
  const viewPlot = (id: string) => {
    focusPlot(id);
    document.getElementById('master-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!rows.length) return <div className="rounded-2xl bg-bone-deep/50 px-6 py-12 text-center"><p className="font-display text-2xl">A little more room to search.</p><p className="mt-2 text-[13px] text-ink/70">Try a different size or budget to find your plot.</p><button type="button" onClick={resetFilters} className="mt-5 min-h-11 rounded-full border border-ink/20 px-5 text-[12px]">Clear filters</button></div>;

  return (
    <>
    <ul className="divide-y divide-ink/10">
      {rows.map((plot) => {
        const active = selectedId === plot.id;
        return <li key={plot.id} className={`group transition-colors ${active ? 'bg-lime/25' : 'hover:bg-bone-deep/35'} ${compact ? 'px-1 py-4' : 'px-2 py-6 sm:px-4'}`}>
          <div className={compact ? 'flex flex-wrap items-center gap-3' : 'grid grid-cols-2 items-center gap-x-5 gap-y-4 sm:grid-cols-[82px_minmax(0,1fr)_auto] xl:grid-cols-[82px_minmax(0,1fr)_auto_auto]'}>
            <button type="button" onClick={() => viewPlot(plot.id)} className={`numeric text-left font-display leading-none transition-colors hover:text-bronze ${compact ? 'min-h-11 w-[56px] text-[25px]' : 'min-h-11 text-[32px]'}`} aria-label={`Explore plot ${plot.id}`}>{plot.id}</button>
            <div className={compact ? 'min-w-[140px] flex-1' : 'min-w-0'}><StatusBadge status={plot.status} /><p className="numeric mt-2 text-[12px] leading-relaxed text-ink/70">{formatSqft(plot.areaSqft)}<span className="mx-2 opacity-45">/</span>{plot.facing}-facing</p>{!compact && <p className="numeric mt-0.5 text-[11px] text-ink/70">{dimensions(plot)}</p>}</div>
            <div className={`numeric whitespace-nowrap font-medium text-ink ${compact ? 'text-[14px]' : 'text-[18px] sm:text-right'}`}>{formatINR(plot.price)}{!compact && <div className="mt-1 text-[10px] font-normal uppercase tracking-[0.14em] text-ink/70">Indicative price</div>}</div>
            <div className={`flex items-center gap-2 ${compact ? 'w-full justify-end' : 'justify-end sm:col-start-2 xl:col-start-auto'}`}>
              <button type="button" onClick={() => viewPlot(plot.id)} aria-label={`View plot ${plot.id} in the master plan`} className="flex min-h-10 items-center gap-1.5 rounded-full border border-ink/15 px-3.5 text-[11px] text-ink/70 transition-colors hover:border-ink hover:bg-ink hover:text-bone"><Crosshair size={13} aria-hidden="true" />View</button>
              <button type="button" onClick={() => { setEnquiryPlot(plot.id); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} aria-label={`Enquire about plot ${plot.id}`} className="flex min-h-10 items-center gap-2 rounded-full bg-ink/5 px-3.5 text-[11px] text-ink transition-colors hover:bg-lime">Enquire<ArrowUpRight size={14} aria-hidden="true" /></button>
            </div>
          </div>
        </li>;
      })}
    </ul>
    {!limit && <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 px-2 pt-6 sm:px-4"><p className="numeric text-[11px] text-ink/70" aria-live="polite">Showing {rows.length} of {matching.length} plots</p>{visibleCount < matching.length && <button type="button" onClick={() => setVisibleCount((count) => count + 8)} className="inline-flex min-h-12 items-center gap-3 rounded-full border border-ink/20 px-5 text-[12px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone">Explore more plots<ArrowDown size={14} aria-hidden="true" /></button>}</div>}
    </>
  );
}
