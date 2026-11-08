'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play, X } from 'lucide-react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import PlanPlaceholder from '@/components/ui/PlanPlaceholder';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import ExplorerToolbar from '@/components/explorer/ExplorerToolbar';
import PlotFilters from '@/components/explorer/PlotFilters';
import PlotDetails from '@/components/explorer/PlotDetails';
import InventoryList from '@/components/explorer/InventoryList';
import Legend from '@/components/explorer/Legend';
import HousePreviewControl from '@/components/explorer/HousePreviewControl';
import AmenityList from '@/components/explorer/AmenityList';
import { useExplorerStore, type PanDirection } from '@/lib/store';
import { subscribeWalk, walkRuntime } from '@/lib/walk-runtime';

const TownshipCanvas = dynamic(() => import('@/components/three/TownshipCanvas'), {
  ssr: false,
  loading: () => <PlanPlaceholder className="absolute inset-0 h-full w-full" />,
});

function WalkControls() {
  const [progress, setProgress] = useState(walkRuntime.t);
  const cameraMode = useExplorerStore((state) => state.cameraMode);
  const setCameraMode = useExplorerStore((state) => state.setCameraMode);

  useEffect(() => subscribeWalk(setProgress), []);

  if (cameraMode !== 'walk') return null;

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-ink/85 to-transparent px-4 py-4">
      <button
        type="button"
        onClick={() => {
          walkRuntime.playing = !walkRuntime.playing;
          setProgress(walkRuntime.t);
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-bone/40 text-bone transition-colors hover:bg-bone hover:text-ink"
        aria-label={walkRuntime.playing ? 'Pause the walkthrough' : 'Play the walkthrough'}
      >
        {walkRuntime.playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
      </button>

      <div className="flex-1">
        <div className="h-[3px] w-full rounded-full bg-bone/25">
          <div
            className="h-full rounded-full bg-bronze-soft transition-[width] duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-bone/60">
          Street-level walkthrough · gate to avenue to link road
        </p>
      </div>

      <button
        type="button"
        onClick={() => setCameraMode('aerial')}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-bone/40 text-bone transition-colors hover:bg-bone hover:text-ink"
        aria-label="Exit the walkthrough"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

function DirectionalControls() {
  const cameraMode = useExplorerStore((state) => state.cameraMode);
  const panCamera = useExplorerStore((state) => state.panCamera);
  const directions: { direction: PanDirection; label: string; icon: typeof ArrowUp; position: string }[] = [
    { direction: 'up', label: 'Pan up', icon: ArrowUp, position: 'col-start-2 row-start-1' },
    { direction: 'left', label: 'Pan left', icon: ArrowLeft, position: 'col-start-1 row-start-2' },
    { direction: 'down', label: 'Pan down', icon: ArrowDown, position: 'col-start-2 row-start-2' },
    { direction: 'right', label: 'Pan right', icon: ArrowRight, position: 'col-start-3 row-start-2' },
  ];

  if (cameraMode === 'walk') return null;

  return (
    <div
      role="group"
      aria-label="Move around the plot"
      className="pointer-events-auto absolute bottom-3 right-3 z-10 grid grid-cols-3 grid-rows-2 gap-1 rounded-sm border border-ink/15 bg-bone/90 p-1.5 shadow-sm backdrop-blur-md"
    >
      {directions.map(({ direction, label, icon: Icon, position }) => (
        <button
          key={direction}
          type="button"
          onClick={() => panCamera(direction)}
          aria-label={label}
          title={label}
          className={`flex h-9 w-9 items-center justify-center rounded-[2px] text-ink/70 transition-colors hover:bg-ink hover:text-bone focus-visible:bg-ink focus-visible:text-bone ${position}`}
        >
          <Icon size={16} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

export default function MasterPlan() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  const selectedId = useExplorerStore((state) => state.selectedId);
  const clearSelection = useExplorerStore((state) => state.clearSelection);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px), (pointer: coarse)');
    const update = () => setQuality(query.matches ? 'low' : 'high');
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // A gallery capture needs the model alive even when the section is offscreen.
  const captureRequest = useExplorerStore((state) => state.captureRequest);
  useEffect(() => {
    if (captureRequest) setMounted(true);
  }, [captureRequest]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    const element = stageRef.current;
    if (!element) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    } else {
      element.requestFullscreen?.().catch(() => undefined);
    }
  };

  return (
    <section
      id="master-plan"
      ref={sectionRef}
      className="scroll-mt-24 bg-bone px-3 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow="Immersive master plan"
            title={
              <>
                A working plan, <span className="italic text-bronze">not a picture of one.</span>
              </>
            }
            intro="Drag to orbit, scroll to zoom, walk the streets, and open any parcel for its exact dimensions, price and frontage. Filters dim the model and filter the inventory at the same time. Everything here is also available as text — you never need the canvas to get the information."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_398px] lg:gap-8">
          {/* ------------------------------------------------- stage */}
          <div className="lg:sticky lg:top-20 lg:h-[calc(100svh-6rem)]">
            <div
              ref={stageRef}
              className="relative h-[54vh] w-full overflow-hidden rounded-sm border border-ink/12 bg-sand sm:h-[62vh] lg:h-full stage-fullscreen"
            >
              {mounted ? (
                <TownshipCanvas
                  variant="explorer"
                  quality={quality}
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <PlanPlaceholder className="absolute inset-0 h-full w-full" />
              )}

              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap justify-between gap-2 p-3">
                <ExplorerToolbar onFullscreen={toggleFullscreen} fullscreen={fullscreen} />
              </div>

              <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden sm:block">
                <Legend />
              </div>

              <DirectionalControls />
              <WalkControls />
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-ink/45">
              Model geometry is generated from the plot dataset below. It is a design model, not a
              legal survey, and the ground beyond the compound is indicative landscape.
            </p>
          </div>

          {/* ------------------------------------------------- sidebar */}
          <div className="space-y-8 pb-24 lg:pb-0">
            <PlotFilters />
            <PlotDetails />
            <HousePreviewControl />

            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="eyebrow text-ink/55">Inventory</h3>
                <a
                  href="#plots"
                  className="link-underline text-[11px] uppercase tracking-[0.16em] text-ink/50 hover:text-ink"
                >
                  Full list
                </a>
              </div>
              <div className="mt-2">
                <InventoryList limit={8} />
              </div>
            </div>

            <AmenityList />
          </div>
        </div>
      </div>

      {/* --------------------------------------------- mobile bottom sheet */}
      {selectedId && (
        <div className="fixed inset-x-0 bottom-0 z-40 max-h-[74svh] overflow-y-auto rounded-t-xl border-t border-ink/15 bg-bone px-5 pb-8 pt-3 shadow-[0_-24px_60px_-34px_rgba(18,28,22,0.8)] lg:hidden">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/20" />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearSelection}
              aria-label="Close parcel details"
              className="rounded-sm p-1 text-ink/45 hover:text-ink"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <PlotDetails compact />
        </div>
      )}
    </section>
  );
}
