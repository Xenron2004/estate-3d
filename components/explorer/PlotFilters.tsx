'use client';

import { useId } from 'react';
import { Search, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { useExplorerStore } from '@/lib/store';
import { FACINGS } from '@/lib/data/township';
import type { Facing, PlotStatus } from '@/lib/types';

const STATUS_OPTIONS: { id: 'all' | PlotStatus; label: string }[] = [
  { id: 'all', label: 'All plots' }, { id: 'available', label: 'Available' },
  { id: 'booked', label: 'Booked' }, { id: 'sold', label: 'Sold' },
];
const AREA_OPTIONS = [
  { id: 'any', label: 'Any size', min: null, max: null },
  { id: 'small', label: 'Up to 3,100 sq ft', min: null, max: 3100 },
  { id: 'mid', label: '3,100 – 3,500 sq ft', min: 3100, max: 3500 },
  { id: 'large', label: '3,500 sq ft and above', min: 3500, max: null },
];
const BUDGET_OPTIONS = [
  { id: 'any', label: 'Any budget', min: null, max: null },
  { id: 'b1', label: 'Up to ₹1.10 Cr', min: null, max: 11000000 },
  { id: 'b2', label: '₹1.10 – ₹1.25 Cr', min: 11000000, max: 12500000 },
  { id: 'b3', label: '₹1.25 – ₹1.40 Cr', min: 12500000, max: 14000000 },
  { id: 'b4', label: '₹1.40 Cr and above', min: 14000000, max: null },
];
const fieldClass = 'min-h-12 w-full rounded-xl border border-ink/10 bg-white/75 px-3.5 text-[13px] text-ink transition-colors focus:border-bronze';

export default function PlotFilters() {
  const id = useId();
  const filters = useExplorerStore((state) => state.filters);
  const setFilter = useExplorerStore((state) => state.setFilter);
  const resetFilters = useExplorerStore((state) => state.resetFilters);
  const filteredIds = useExplorerStore((state) => state.filteredIds);
  const plots = useExplorerStore((state) => state.plots);
  const areaValue = AREA_OPTIONS.find((option) => option.min === filters.minArea && option.max === filters.maxArea)?.id ?? 'any';
  const budgetValue = BUDGET_OPTIONS.find((option) => option.min === filters.minBudget && option.max === filters.maxBudget)?.id ?? 'any';
  const isDefault = filters.status === 'all' && filters.facing === 'all' && filters.minArea === null && filters.maxArea === null && filters.minBudget === null && filters.maxBudget === null && filters.query === '';

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2.5 font-sans text-[13px] font-medium tracking-normal"><SlidersHorizontal size={15} aria-hidden="true" />Find your plot</h3>
        <span className="numeric rounded-full bg-ink/5 px-2.5 py-1.5 text-[11px] text-ink/70">{filteredIds.length} / {plots.length}</span>
      </div>
      <div className="relative mt-5">
        <label htmlFor={`${id}-search`} className="sr-only">Search plots by ID</label>
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/70" />
        <input id={`${id}-search`} type="search" placeholder="Search a plot, e.g. A-07" value={filters.query} onChange={(event) => setFilter({ query: event.target.value })} className={`${fieldClass} pl-10 pr-10 placeholder:text-ink/70`} />
        {filters.query && <button type="button" onClick={() => setFilter({ query: '' })} aria-label="Clear plot search" className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5"><X size={15} aria-hidden="true" /></button>}
      </div>
      <fieldset className="mt-5">
        <legend className="mb-2.5 text-[11px] font-medium text-ink/70">Availability</legend>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((option) => {
            const active = filters.status === option.id;
            const count = option.id === 'all' ? plots.length : plots.filter((plot) => plot.status === option.id).length;
            return <button key={option.id} type="button" onClick={() => setFilter({ status: option.id })} aria-pressed={active} className={`flex min-h-11 items-center justify-between gap-2 rounded-full border px-3.5 text-[12px] transition-colors ${active ? 'border-ink bg-ink text-bone' : 'border-ink/10 bg-white/40 text-ink/70 hover:border-ink/30'}`}>{option.label}<span className="numeric">{count}</span></button>;
          })}
        </div>
      </fieldset>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div><label htmlFor={`${id}-area`} className="mb-2 block text-[11px] font-medium text-ink/70">Plot size</label><select id={`${id}-area`} value={areaValue} onChange={(event) => { const option = AREA_OPTIONS.find((item) => item.id === event.target.value)!; setFilter({ minArea: option.min, maxArea: option.max }); }} className={fieldClass}>{AREA_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></div>
        <div><label htmlFor={`${id}-budget`} className="mb-2 block text-[11px] font-medium text-ink/70">Your budget</label><select id={`${id}-budget`} value={budgetValue} onChange={(event) => { const option = BUDGET_OPTIONS.find((item) => item.id === event.target.value)!; setFilter({ minBudget: option.min, maxBudget: option.max }); }} className={fieldClass}>{BUDGET_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></div>
        <div className="sm:col-span-2 lg:col-span-1"><label htmlFor={`${id}-facing`} className="mb-2 block text-[11px] font-medium text-ink/70">Orientation</label><select id={`${id}-facing`} value={filters.facing} onChange={(event) => setFilter({ facing: event.target.value as Facing | 'all' })} className={fieldClass}><option value="all">All orientations</option>{FACINGS.map((facing) => <option key={facing} value={facing}>{facing.charAt(0).toUpperCase() + facing.slice(1)}-facing</option>)}</select></div>
      </div>
      {!isDefault && <button type="button" onClick={resetFilters} className="mt-5 inline-flex min-h-10 items-center gap-2 text-[12px] text-ink/70 transition-colors hover:text-ink"><RotateCcw size={13} aria-hidden="true" />Reset filters</button>}
    </div>
  );
}
