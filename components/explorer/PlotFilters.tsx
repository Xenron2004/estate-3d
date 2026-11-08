'use client';

import { Search, X } from 'lucide-react';
import { useExplorerStore } from '@/lib/store';
import { AREA_RANGE, FACINGS, STATUS_COUNTS } from '@/lib/data/township';
import type { Facing, PlotStatus } from '@/lib/types';

const STATUS_OPTIONS: { id: 'all' | PlotStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'available', label: 'Available' },
  { id: 'booked', label: 'Booked' },
  { id: 'sold', label: 'Sold' },
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

export default function PlotFilters() {
  const filters = useExplorerStore((state) => state.filters);
  const setFilter = useExplorerStore((state) => state.setFilter);
  const resetFilters = useExplorerStore((state) => state.resetFilters);
  const filteredIds = useExplorerStore((state) => state.filteredIds);
  const plots = useExplorerStore((state) => state.plots);

  const areaValue =
    AREA_OPTIONS.find(
      (option) => option.min === filters.minArea && option.max === filters.maxArea,
    )?.id ?? 'any';
  const budgetValue =
    BUDGET_OPTIONS.find(
      (option) => option.min === filters.minBudget && option.max === filters.maxBudget,
    )?.id ?? 'any';

  const isDefault =
    filters.status === 'all' &&
    filters.facing === 'all' &&
    filters.minArea === null &&
    filters.maxArea === null &&
    filters.minBudget === null &&
    filters.maxBudget === null &&
    filters.query === '';

  return (
    <div className="border-b border-ink/10 pb-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="eyebrow text-ink/55">Filter the township</h3>
        <span className="numeric text-[11px] text-ink/45">
          {filteredIds.length} of {plots.length}
        </span>
      </div>

      <div className="relative mt-4">
        <label htmlFor="plot-search" className="sr-only">
          Search plots by ID
        </label>
        <Search
          size={14}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
        />
        <input
          id="plot-search"
          type="search"
          inputMode="text"
          placeholder="Search by plot ID — A-07, B-12…"
          value={filters.query}
          onChange={(event) => setFilter({ query: event.target.value })}
          className="w-full rounded-sm border border-ink/15 bg-bone-deep/50 py-2.5 pl-9 pr-9 text-[13px] text-ink placeholder:text-ink/35 focus:border-bronze focus:outline-none"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => setFilter({ query: '' })}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <fieldset className="mt-5">
        <legend className="eyebrow mb-2 text-ink/45">Availability</legend>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((option) => {
            const active = filters.status === option.id;
            const count =
              option.id === 'all' ? plots.length : STATUS_COUNTS[option.id as PlotStatus];
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter({ status: option.id })}
                aria-pressed={active}
                className={`rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? 'border-ink bg-ink text-bone'
                    : 'border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink'
                }`}
              >
                {option.label}
                <span className="numeric ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label htmlFor="filter-area" className="eyebrow mb-2 block text-ink/45">
            Plot size
          </label>
          <select
            id="filter-area"
            value={areaValue}
            onChange={(event) => {
              const option = AREA_OPTIONS.find((item) => item.id === event.target.value)!;
              setFilter({ minArea: option.min, maxArea: option.max });
            }}
            className="w-full rounded-sm border border-ink/15 bg-bone-deep/50 px-3 py-2.5 text-[13px] text-ink focus:border-bronze focus:outline-none"
          >
            {AREA_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[10.5px] text-ink/40">
            Plots range {AREA_RANGE.min.toLocaleString('en-IN')}–
            {AREA_RANGE.max.toLocaleString('en-IN')} sq ft.
          </p>
        </div>

        <div>
          <label htmlFor="filter-budget" className="eyebrow mb-2 block text-ink/45">
            Budget
          </label>
          <select
            id="filter-budget"
            value={budgetValue}
            onChange={(event) => {
              const option = BUDGET_OPTIONS.find((item) => item.id === event.target.value)!;
              setFilter({ minBudget: option.min, maxBudget: option.max });
            }}
            className="w-full rounded-sm border border-ink/15 bg-bone-deep/50 px-3 py-2.5 text-[13px] text-ink focus:border-bronze focus:outline-none"
          >
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-facing" className="eyebrow mb-2 block text-ink/45">
            Facing
          </label>
          <select
            id="filter-facing"
            value={filters.facing}
            onChange={(event) => setFilter({ facing: event.target.value as Facing | 'all' })}
            className="w-full rounded-sm border border-ink/15 bg-bone-deep/50 px-3 py-2.5 text-[13px] text-ink focus:border-bronze focus:outline-none"
          >
            <option value="all">All orientations</option>
            {FACINGS.map((facing) => (
              <option key={facing} value={facing}>
                {facing.charAt(0).toUpperCase() + facing.slice(1)}-facing
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isDefault && (
        <button
          type="button"
          onClick={resetFilters}
          className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-ink/50 transition-colors hover:text-ink"
        >
          <X size={12} aria-hidden="true" />
          Reset filters
        </button>
      )}
    </div>
  );
}
