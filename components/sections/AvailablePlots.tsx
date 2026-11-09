'use client';

import { useMemo } from 'react';
import { ArrowDownRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import PlotFilters from '@/components/explorer/PlotFilters';
import InventoryList from '@/components/explorer/InventoryList';
import { useExplorerStore } from '@/lib/store';

export default function AvailablePlots() {
  const plots = useExplorerStore((state) => state.plots);
  const filteredIds = useExplorerStore((state) => state.filteredIds);
  const dataStatus = useExplorerStore((state) => state.dataStatus);
  const available = useMemo(() => plots.filter((plot) => plot.status === 'available').length, [plots]);

  return (
    <section id="plots" className="section-space scroll-mt-24 bg-bone">
      <div className="site-shell">
        <Reveal>
          <div className="flex items-start justify-between gap-6 border-t border-ink/15 pt-6"><p className="eyebrow">04 / Find your place</p><span className="flex items-center gap-2 text-[11px] text-ink/70"><span className="h-1.5 w-1.5 rounded-full bg-available" />{available} plots available</span></div>
          <div className="mt-9 grid items-end gap-6 lg:grid-cols-[1fr_330px]">
            <h2 className="max-w-[12ch] font-display text-[clamp(3rem,6.8vw,6.4rem)] leading-[0.98] tracking-[-0.055em]">A little land.<br /><span className="italic text-bronze">A lot of possibility.</span></h2>
            <div className="flex items-end gap-6 pb-2"><p className="max-w-[28ch] text-[14px] leading-[1.7] text-ink/70">Explore {plots.length} individual plots. Find the space, orientation and outlook that feel right for you.</p><ArrowDownRight className="hidden shrink-0 text-ink/70 sm:block" size={42} strokeWidth={1} aria-hidden="true" /></div>
          </div>
        </Reveal>
        <div className="mt-12 grid items-start gap-7 lg:mt-16 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-12">
          <div className="rounded-[24px] border border-ink/8 bg-bone-deep/60 p-5 sm:p-6 lg:sticky lg:top-28"><PlotFilters /></div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 px-2 pb-5 sm:px-4"><h3 className="font-sans text-[13px] font-medium tracking-normal"><span className="numeric">{filteredIds.length}</span> {filteredIds.length === 1 ? 'plot' : 'plots'} to explore</h3><span className="text-[11px] text-ink/70" aria-live="polite">{dataStatus === 'loading' ? 'Updating availability…' : dataStatus === 'error' ? 'Illustrative availability' : 'Current collection'}</span></div>
            <InventoryList />
            <p className="mt-6 max-w-[68ch] text-[11px] leading-relaxed text-ink/70">Aurelia Estates is an illustrative development. Prices and availability are demonstration values; final details are subject to verification.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
