'use client';

import { create } from 'zustand';
import type {
  CameraMode,
  Facing,
  GalleryPreset,
  HouseStyle,
  Plot,
  PlotStatus,
  TimeOfDay,
} from './types';
import { PLOTS as CANONICAL_PLOTS } from './data/township';
import { AMENITY_BY_ID } from './data/amenities';
import { CAMERA_PRESETS, plotCamera } from './camera';
import { walkRuntime } from './walk-runtime';

export interface Filters {
  status: 'all' | PlotStatus;
  facing: 'all' | Facing;
  minArea: number | null;
  maxArea: number | null;
  minBudget: number | null;
  maxBudget: number | null;
  query: string;
}

export const DEFAULT_FILTERS: Filters = {
  status: 'all',
  facing: 'all',
  minArea: null,
  maxArea: null,
  minBudget: null,
  maxBudget: null,
  query: '',
};

function normaliseQuery(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchesQuery(plot: Plot, query: string): boolean {
  const q = normaliseQuery(query);
  if (!q) return true;
  const id = plot.id.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (id.includes(q)) return true;
  // "a7" should match A-07, "b" should match every B block parcel
  if (q.length === 1) return plot.id.toLowerCase().startsWith(q);
  return false;
}

function computeFiltered(plots: Plot[], filters: Filters): string[] {
  return plots
    .filter((plot) => {
      if (filters.status !== 'all' && plot.status !== filters.status) return false;
      if (filters.facing !== 'all' && plot.facing !== filters.facing) return false;
      if (filters.minArea !== null && plot.areaSqft < filters.minArea) return false;
      if (filters.maxArea !== null && plot.areaSqft > filters.maxArea) return false;
      if (filters.minBudget !== null && plot.price < filters.minBudget) return false;
      if (filters.maxBudget !== null && plot.price > filters.maxBudget) return false;
      if (!matchesQuery(plot, filters.query)) return false;
      return true;
    })
    .map((plot) => plot.id);
}

interface CameraRequest {
  id: number;
  position: [number, number, number];
  target: [number, number, number];
  mode: CameraMode;
}

interface ExplorerState {
  plots: Plot[];
  dataStatus: 'idle' | 'loading' | 'ready' | 'error';
  dataError: string | null;
  filters: Filters;
  filteredIds: string[];
  selectedId: string | null;
  hoveredId: string | null;
  cameraMode: CameraMode;
  cameraRequest: CameraRequest | null;
  timeOfDay: TimeOfDay;
  previousTimeOfDay: TimeOfDay | null;
  labelsVisible: boolean;
  houseStyle: HouseStyle;
  activeAmenity: string | null;
  captureRequest: { id: number; preset: GalleryPreset } | null;
  captures: Record<string, string>;
  enquiryPlot: string | null;
  walkActive: boolean;

  setPlots: (plots: Plot[]) => void;
  setDataStatus: (status: ExplorerState['dataStatus'], error?: string | null) => void;
  setFilter: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  selectPlot: (id: string, options?: { focus?: boolean }) => void;
  clearSelection: () => void;
  setHovered: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  requestCamera: (
    position: [number, number, number],
    target: [number, number, number],
    mode?: CameraMode,
  ) => void;
  focusPlot: (id: string) => void;
  focusAmenity: (id: string) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  toggleLabels: () => void;
  setHouseStyle: (style: HouseStyle) => void;
  requestCapture: (preset: GalleryPreset) => void;
  clearCaptureRequest: () => void;
  setCapture: (id: string, dataUrl: string) => void;
  setEnquiryPlot: (id: string | null) => void;
  setWalkActive: (active: boolean) => void;
}

let requestCounter = 0;

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  plots: CANONICAL_PLOTS,
  dataStatus: 'idle',
  dataError: null,
  filters: { ...DEFAULT_FILTERS },
  filteredIds: CANONICAL_PLOTS.map((plot) => plot.id),
  selectedId: null,
  hoveredId: null,
  cameraMode: 'aerial',
  cameraRequest: {
    id: ++requestCounter,
    position: CAMERA_PRESETS.home.position,
    target: CAMERA_PRESETS.home.target,
    mode: 'aerial',
  },
  timeOfDay: 'day',
  previousTimeOfDay: null,
  labelsVisible: false,
  houseStyle: 'none',
  activeAmenity: null,
  captureRequest: null,
  captures: {},
  enquiryPlot: null,
  walkActive: false,

  setPlots: (plots) =>
    set((state) => ({
      plots,
      filteredIds: computeFiltered(plots, state.filters),
    })),

  setDataStatus: (dataStatus, dataError = null) => set({ dataStatus, dataError }),

  setFilter: (patch) =>
    set((state) => {
      const filters = { ...state.filters, ...patch };
      return { filters, filteredIds: computeFiltered(state.plots, filters) };
    }),

  resetFilters: () =>
    set((state) => ({
      filters: { ...DEFAULT_FILTERS },
      filteredIds: computeFiltered(state.plots, DEFAULT_FILTERS),
    })),

  selectPlot: (id, options) => {
    const { plots } = get();
    const plot = plots.find((item) => item.id === id);
    if (!plot) return;
    set({
      selectedId: id,
      houseStyle: 'none',
      activeAmenity: null,
      ...(options?.focus === false
        ? {}
        : (() => {
            const { position, target } = plotCamera(plot);
            return {
              cameraRequest: {
                id: ++requestCounter,
                position,
                target,
                mode: 'aerial' as CameraMode,
              },
            };
          })()),
    });
  },

  clearSelection: () => set({ selectedId: null, houseStyle: 'none' }),

  setHovered: (id) => set({ hoveredId: id }),

  setCameraMode: (mode) => {
    const presets: Record<CameraMode, { position: [number, number, number]; target: [number, number, number] }> = {
      aerial: CAMERA_PRESETS.home,
      orbit: CAMERA_PRESETS.home,
      plan: CAMERA_PRESETS.plan,
      walk: CAMERA_PRESETS.entrance,
    };
    const preset = presets[mode];
    walkRuntime.playing = mode === 'walk';
    set((state) => ({
      cameraMode: mode,
      walkActive: mode === 'walk',
      cameraRequest: {
        id: ++requestCounter,
        position: preset.position,
        target: preset.target,
        mode,
      },
    }));
  },

  requestCamera: (position, target, mode) =>
    set((state) => ({
      cameraMode: mode ?? state.cameraMode,
      cameraRequest: { id: ++requestCounter, position, target, mode: mode ?? state.cameraMode },
    })),

  focusPlot: (id) => {
    const { plots } = get();
    const plot = plots.find((item) => item.id === id);
    if (!plot) return;
    const { position, target } = plotCamera(plot);
    set({
      selectedId: id,
      activeAmenity: null,
      houseStyle: 'none',
      walkActive: false,
      cameraMode: 'aerial',
      cameraRequest: { id: ++requestCounter, position, target, mode: 'aerial' },
    });
  },

  focusAmenity: (id) => {
    const amenity = AMENITY_BY_ID[id];
    if (!amenity) return;
    set({
      activeAmenity: id,
      selectedId: null,
      houseStyle: 'none',
      walkActive: false,
      cameraMode: 'aerial',
      cameraRequest: {
        id: ++requestCounter,
        position: amenity.camera.position,
        target: amenity.camera.target,
        mode: 'aerial',
      },
    });
  },

  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  toggleLabels: () => set((state) => ({ labelsVisible: !state.labelsVisible })),
  setHouseStyle: (houseStyle) => set({ houseStyle }),
  requestCapture: (preset) =>
    set((state) => ({
      captureRequest: { id: ++requestCounter, preset },
      previousTimeOfDay: state.timeOfDay,
      timeOfDay: preset.timeOfDay,
    })),
  clearCaptureRequest: () =>
    set((state) => ({
      captureRequest: null,
      timeOfDay: state.previousTimeOfDay ?? state.timeOfDay,
      previousTimeOfDay: null,
    })),
  setCapture: (id, dataUrl) => set((state) => ({ captures: { ...state.captures, [id]: dataUrl } })),
  setEnquiryPlot: (enquiryPlot) => set({ enquiryPlot }),
  setWalkActive: (walkActive) => set({ walkActive }),
}));
