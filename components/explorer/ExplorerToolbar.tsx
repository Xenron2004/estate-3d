'use client';

import {
  Compass,
  Eye,
  Grid3x3,
  Maximize2,
  RotateCcw,
  Route,
  Sun,
  Sunrise,
  Moon,
} from 'lucide-react';
import { useExplorerStore } from '@/lib/store';
import type { CameraMode, TimeOfDay } from '@/lib/types';

const VIEWS: { id: CameraMode; label: string; icon: typeof Compass }[] = [
  { id: 'aerial', label: 'Aerial', icon: Compass },
  { id: 'orbit', label: 'Orbit', icon: Eye },
  { id: 'plan', label: 'Master plan', icon: Grid3x3 },
  { id: 'walk', label: 'Walkthrough', icon: Route },
];

const TIMES: { id: TimeOfDay; label: string; icon: typeof Sun }[] = [
  { id: 'day', label: 'Day', icon: Sun },
  { id: 'golden', label: 'Golden', icon: Sunrise },
  { id: 'dusk', label: 'Dusk', icon: Moon },
];

export default function ExplorerToolbar({
  onFullscreen,
  fullscreen,
}: {
  onFullscreen: () => void;
  fullscreen: boolean;
}) {
  const cameraMode = useExplorerStore((state) => state.cameraMode);
  const setCameraMode = useExplorerStore((state) => state.setCameraMode);
  const timeOfDay = useExplorerStore((state) => state.timeOfDay);
  const setTimeOfDay = useExplorerStore((state) => state.setTimeOfDay);
  const labelsVisible = useExplorerStore((state) => state.labelsVisible);
  const toggleLabels = useExplorerStore((state) => state.toggleLabels);
  const requestCamera = useExplorerStore((state) => state.requestCamera);
  const selectedId = useExplorerStore((state) => state.selectedId);
  const plots = useExplorerStore((state) => state.plots);

  const reset = () => {
    const plot = plots.find((item) => item.id === selectedId);
    if (plot) {
      requestCamera([82, 88, 272], [0, 0, 96], 'aerial');
    } else {
      requestCamera([82, 88, 272], [0, 0, 96], 'aerial');
    }
  };

  return (
    <div className="pointer-events-auto flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-sm border border-ink/12 bg-bone/92 p-1 backdrop-blur-md">
        {VIEWS.map((view) => {
          const Icon = view.icon;
          const active = cameraMode === view.id;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => setCameraMode(view.id)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-[2px] px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                active ? 'bg-ink text-bone' : 'text-ink/60 hover:text-ink'
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 rounded-sm border border-ink/12 bg-bone/92 p-1 backdrop-blur-md">
        {TIMES.map((time) => {
          const Icon = time.icon;
          const active = timeOfDay === time.id;
          return (
            <button
              key={time.id}
              type="button"
              onClick={() => setTimeOfDay(time.id)}
              aria-pressed={active}
              title={`${time.label} light`}
              className={`flex items-center gap-1.5 rounded-[2px] px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                active ? 'bg-ink text-bone' : 'text-ink/60 hover:text-ink'
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              <span className="hidden md:inline">{time.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 rounded-sm border border-ink/12 bg-bone/92 p-1 backdrop-blur-md">
        <button
          type="button"
          onClick={toggleLabels}
          aria-pressed={labelsVisible}
          className={`rounded-[2px] px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
            labelsVisible ? 'bg-ink text-bone' : 'text-ink/60 hover:text-ink'
          }`}
        >
          Labels
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 rounded-[2px] px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.14em] text-ink/60 transition-colors hover:text-ink"
          title="Reset the view"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span className="hidden sm:inline">Reset</span>
        </button>
        <button
          type="button"
          onClick={onFullscreen}
          aria-pressed={fullscreen}
          className="flex items-center gap-1.5 rounded-[2px] px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.14em] text-ink/60 transition-colors hover:text-ink"
          title="Fullscreen explorer"
        >
          <Maximize2 size={13} aria-hidden="true" />
          <span className="hidden sm:inline">Full</span>
        </button>
      </div>
    </div>
  );
}
