'use client';

import { useExplorerStore } from '@/lib/store';

export default function HousePreviewControl() {
  const houseStyle = useExplorerStore((state) => state.houseStyle);
  const setHouseStyle = useExplorerStore((state) => state.setHouseStyle);
  const selectedId = useExplorerStore((state) => state.selectedId);
  const plots = useExplorerStore((state) => state.plots);
  const plot = plots.find((item) => item.id === selectedId);
  const enabled = plot?.status === 'available';

  const options: { id: 'none' | 'single' | 'double'; label: string }[] = [
    { id: 'none', label: 'No house' },
    { id: 'single', label: 'One floor' },
    { id: 'double', label: 'Two floors' },
  ];

  return (
    <div className="rounded-sm border border-ink/12 bg-bone-deep/50 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="eyebrow text-ink/55">Visualize your future home</h3>
        <span className="eyebrow text-bronze">Concept</span>
      </div>

      <div className="mt-3 flex gap-1.5">
        {options.map((option) => {
          const active = houseStyle === option.id;
          const disabled = !enabled && option.id !== 'none';
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => setHouseStyle(option.id)}
              aria-pressed={active}
              className={`flex-1 rounded-sm border px-2 py-2 text-[10.5px] uppercase tracking-[0.12em] transition-colors ${
                active
                  ? 'border-ink bg-ink text-bone'
                  : 'border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ink/45">
        {enabled
          ? 'A scaled massing study placed on the parcel with generous setbacks, shown for scale only.'
          : 'Select an available parcel to preview a concept home on it.'}
        {' '}
        It is <span className="text-ink/70">not a sanctioned plan</span> and carries no architectural
        or statutory approval.
      </p>
    </div>
  );
}
