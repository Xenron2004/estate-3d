'use client';

import { useMemo } from 'react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import PlotFilters from '@/components/explorer/PlotFilters';
import InventoryList from '@/components/explorer/InventoryList';
import { useExplorerStore } from '@/lib/store';

export default function AvailablePlots() {
  const plots = useExplorerStore((state) => state.plots);
  const filteredIds = useExplorerStore((state) => state.filteredIds);
  const dataStatus = useExplorerStore((state) => state.dataStatus);

  const available = useMemo(
    () => plots.filter((plot) => plot.status === 'available').length,
    [plots],
  );

  return (
    <section id="plots" className="scroll-mt-24 bg-bone px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                index="06"
                eyebrow="Available plots"
                title={
                  <>
                    Every parcel, <span className="italic text-bronze">priced and dimensioned.</span>
                  </>
                }
                intro={`${plots.length} parcels in two blocks. ${available} are open for reservation. The filters below are shared with the 3D model — dimming the model and filtering this list are the same action.`}
              />
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-10">
                <PlotFilters />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pt-16">
            <Reveal delay={0.06}>
              <div className="flex items-baseline justify-between gap-4 border-b border-ink/12 pb-4">
                <h3 className="eyebrow text-ink/55">
                  {filteredIds.length} {filteredIds.length === 1 ? 'parcel' : 'parcels'}
                </h3>
                <span className="text-[11px] text-ink/40">
                  {dataStatus === 'loading'
                    ? 'Syncing availability…'
                    : dataStatus === 'error'
                      ? 'Showing the built-in dataset'
                      : 'Live availability'}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-2">
                <InventoryList />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 text-[12px] leading-relaxed text-ink/50">
                Prices are fictional demonstration values. Area, rate and total are computed from the
                same parcel geometry used by the 3D model, so the two can never disagree.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
