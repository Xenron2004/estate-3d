'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play, SlidersHorizontal, X } from 'lucide-react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import PlanPlaceholder from '@/components/ui/PlanPlaceholder';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import ExplorerToolbar from '@/components/explorer/ExplorerToolbar';
import PlotFilters from '@/components/explorer/PlotFilters';
import PlotDetails from '@/components/explorer/PlotDetails';
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
    <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-10 flex items-center gap-3 rounded-2xl bg-ink/95 px-4 py-4 text-bone">
      <button
        type="button"
        onClick={() => {
          walkRuntime.playing = !walkRuntime.playing;
          setProgress(walkRuntime.t);
        }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors hover:bg-lime hover:text-ink"
        aria-label={walkRuntime.playing ? 'Pause the walkthrough' : 'Play the walkthrough'}
      >
        {walkRuntime.playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
      </button>

      <div className="flex-1">
        <div className="h-[3px] w-full rounded-full bg-bone/25">
          <div
            className="h-full rounded-full bg-lime transition-[width] duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-bone/60">
          A walk through the neighbourhood
        </p>
      </div>

      <button
        type="button"
        onClick={() => setCameraMode('aerial')}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors hover:bg-lime hover:text-ink"
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
      className="pointer-events-auto absolute bottom-4 right-4 z-10 grid grid-cols-3 grid-rows-2 gap-0.5 rounded-[18px] border border-white/60 bg-bone/95 p-1.5 shadow-[0_8px_28px_-18px_rgba(22,44,37,0.4)]"
    >
      {directions.map(({ direction, label, icon: Icon, position }) => (
        <button
          key={direction}
          type="button"
          onClick={() => panCamera(direction)}
          aria-label={label}
          title={label}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink hover:text-bone focus-visible:bg-ink focus-visible:text-bone ${position}`}
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
  const [inView, setInView] = useState(false);
  const selectedId = useExplorerStore((state) => state.selectedId);
  const clearSelection = useExplorerStore((state) => state.clearSelection);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedId || !inView) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') clearSelection();
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [selectedId, inView, clearSelection]);

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
      className="section-space scroll-mt-24 bg-bone-deep/65"
    >
      <div className="site-shell">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Explore the neighbourhood"
            title={
              <>
                Walk your future.<br /><span className="italic text-bronze">Before you build it.</span>
              </>
            }
            intro="Follow the avenues. Find a favourite corner. Explore the township in three dimensions, then choose a plot to make your own."
          />
        </Reveal>

        <div className="mt-12 grid items-start gap-5 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-7">
          {/* ------------------------------------------------- stage */}
          <div className="min-w-0 lg:sticky lg:top-24">
            <div
              ref={stageRef}
              className="stage-fullscreen relative h-[62svh] min-h-[430px] w-full overflow-hidden rounded-[24px] border border-white/70 bg-sand sm:h-[68svh] lg:h-[calc(100svh-10rem)] lg:min-h-[560px]"
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

              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap justify-between gap-2 p-3 sm:p-4">
                <ExplorerToolbar onFullscreen={toggleFullscreen} fullscreen={fullscreen} />
              </div>

              <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden xl:block">
                <Legend />
              </div>

              <DirectionalControls />
              <WalkControls />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 text-[11px] text-ink/70"><p>Drag to explore · Scroll to zoom · Select a plot</p><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-available" />Live 3D experience</span></div>
          </div>

          {/* ------------------------------------------------- sidebar */}
          <div className="space-y-5 pb-6">
            <PlotDetails />
            <HousePreviewControl />
            <details className="group rounded-[20px] border border-ink/8 bg-white/55 p-5">
              <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-medium"><span className="flex items-center gap-2"><SlidersHorizontal size={15} aria-hidden="true" />Refine your search</span><span className="text-lg font-normal group-open:hidden" aria-hidden="true">+</span><span className="hidden text-lg font-normal group-open:block" aria-hidden="true">−</span></summary>
              <div className="mt-5 border-t border-ink/10 pt-5"><PlotFilters /></div>
            </details>
            <a href="#plots" className="flex min-h-14 items-center justify-between rounded-full bg-ink px-6 text-[12px] text-bone transition-colors hover:bg-ink-soft">Browse the plot collection<ArrowUpRight size={17} aria-hidden="true" /></a>
            <div className="rounded-[20px] border border-ink/8 bg-white/55 p-5"><AmenityList /></div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------- mobile bottom sheet */}
      {selectedId && inView && (
        <div role="dialog" aria-modal="false" aria-label="Selected plot details" className="fixed inset-x-2 bottom-2 z-40 max-h-[70svh] overflow-y-auto rounded-[24px] border border-ink/10 bg-bone px-5 pb-6 pt-3 shadow-[0_-12px_60px_-24px_rgba(18,28,22,0.35)] lg:hidden">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/20" />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearSelection}
              aria-label="Close parcel details"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink/70 hover:text-ink"
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
