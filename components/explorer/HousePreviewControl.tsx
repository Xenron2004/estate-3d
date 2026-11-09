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
    <div className="rounded-[20px] border border-ink/8 bg-bone-deep/70 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-sans text-[13px] font-medium tracking-normal text-ink">Imagine your home</h3>
        <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] text-bronze">Concept</span>
      </div>

      <div className="mt-4 flex gap-1.5">
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
              className={`min-h-11 flex-1 rounded-full border px-2 py-2 text-[11px] transition-colors ${
                active
                  ? 'border-ink bg-ink text-bone'
                  : 'border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-ink/70">
        {enabled
          ? 'See how a one or two-storey home could sit within your plot.'
          : 'Select an available plot to explore a one or two-storey home.'}
        {' '}Illustrative concept only, subject to architectural approval.
      </p>
    </div>
  );
}
