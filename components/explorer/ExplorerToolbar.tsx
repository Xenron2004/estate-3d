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
  Building2,
} from 'lucide-react';
import { useExplorerStore } from '@/lib/store';
import type { CameraMode, TimeOfDay } from '@/lib/types';
import { CAMERA_PRESETS } from '@/lib/camera';

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

const groupClass = 'flex max-w-full flex-wrap items-center gap-1 rounded-[18px] border border-white/70 bg-bone/95 p-1.5 shadow-[0_6px_24px_-16px_rgba(22,44,37,0.3)]';
const controlClass = 'flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[11px] transition-colors';

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
  const focusAmenity = useExplorerStore((state) => state.focusAmenity);
  const apartmentsActive = useExplorerStore((state) => state.activeAmenity === 'apartments');

  const reset = () => {
    requestCamera(CAMERA_PRESETS.home.position, CAMERA_PRESETS.home.target, 'aerial');
  };

  return (
    <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-2">
      <div className={groupClass} role="group" aria-label="Camera views">
        {VIEWS.map((view) => {
          const Icon = view.icon;
          const active = cameraMode === view.id && !apartmentsActive;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => setCameraMode(view.id)}
              aria-pressed={active}
              aria-label={view.label}
              className={`${controlClass} ${
                active ? 'bg-ink text-bone' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => focusAmenity('apartments')}
          aria-label="View five new apartment buildings"
          aria-pressed={apartmentsActive}
          title="View the new apartment district"
          className={`${controlClass} ${apartmentsActive ? 'bg-ink text-bone' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'}`}
        >
          <Building2 size={13} aria-hidden="true" />
          <span className="hidden sm:inline">Apartments</span>
        </button>
      </div>

      <div className={groupClass} role="group" aria-label="Time of day">
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
              aria-label={`${time.label} light`}
              className={`${controlClass} ${
                active ? 'bg-ink text-bone' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              <span className="hidden md:inline">{time.label}</span>
            </button>
          );
        })}
      </div>

      <div className={groupClass} role="group" aria-label="Scene controls">
        <button
          type="button"
          onClick={toggleLabels}
          aria-pressed={labelsVisible}
          className={`${controlClass} ${
            labelsVisible ? 'bg-ink text-bone' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
          }`}
        >
          Labels
        </button>
        <button
          type="button"
          onClick={reset}
          className={`${controlClass} text-ink/70 hover:bg-ink/5 hover:text-ink`}
          title="Reset the view"
          aria-label="Reset the view"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span className="hidden sm:inline">Reset</span>
        </button>
        <button
          type="button"
          onClick={onFullscreen}
          aria-pressed={fullscreen}
          className={`${controlClass} text-ink/70 hover:bg-ink/5 hover:text-ink`}
          title="Fullscreen explorer"
          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <Maximize2 size={13} aria-hidden="true" />
          <span className="hidden sm:inline">Full</span>
        </button>
      </div>
    </div>
  );
}
