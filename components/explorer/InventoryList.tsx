'use client';

import { useMemo } from 'react';
import { Crosshair, MessageSquare } from 'lucide-react';
import { useExplorerStore } from '@/lib/store';
import StatusBadge from '@/components/ui/StatusBadge';
import { dimensions, formatINR, formatSqft } from '@/lib/format';

export default function InventoryList({ limit }: { limit?: number }) {
  const plots = useExplorerStore((state) => state.plots);
  const filteredIds = useExplorerStore((state) => state.filteredIds);
  const selectedId = useExplorerStore((state) => state.selectedId);
  const focusPlot = useExplorerStore((state) => state.focusPlot);
  const setEnquiryPlot = useExplorerStore((state) => state.setEnquiryPlot);

  const rows = useMemo(() => {
    const allowed = new Set(filteredIds);
    const matching = plots.filter((plot) => allowed.has(plot.id));
    return limit ? matching.slice(0, limit) : matching;
  }, [plots, filteredIds, limit]);

  if (!rows.length) {
    return (
      <p className="rounded-sm border border-dashed border-ink/20 px-4 py-6 text-center text-[13px] text-ink/50">
        No parcels match these filters. Try widening the budget or size band.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-ink/10">
      {rows.map((plot) => {
        const active = selectedId === plot.id;
        return (
          <li key={plot.id} className={active ? 'bg-bone-deep/60' : ''}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3.5">
              <button
                type="button"
                onClick={() => focusPlot(plot.id)}
                className="numeric w-[52px] text-left font-display text-[19px] text-ink transition-colors hover:text-bronze"
                aria-label={`Focus plot ${plot.id} in the 3D scene`}
              >
                {plot.id}
              </button>

              <div className="min-w-[120px] flex-1">
                <StatusBadge status={plot.status} />
                <div className="numeric mt-1 text-[11.5px] text-ink/55">
                  {formatSqft(plot.areaSqft)} · {dimensions(plot)} · {plot.facing}-facing
                </div>
              </div>

              <div className="numeric text-[14px] text-ink">{formatINR(plot.price)}</div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    focusPlot(plot.id);
                    document
                      .getElementById('master-plan')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex items-center gap-1.5 rounded-sm border border-ink/15 px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.12em] text-ink/65 transition-colors hover:border-ink hover:text-ink"
                >
                  <Crosshair size={12} aria-hidden="true" />
                  View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnquiryPlot(plot.id);
                    document
                      .getElementById('contact')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex items-center gap-1.5 rounded-sm border border-ink/15 px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.12em] text-ink/65 transition-colors hover:border-ink hover:text-ink"
                >
                  <MessageSquare size={12} aria-hidden="true" />
                  Enquire
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
