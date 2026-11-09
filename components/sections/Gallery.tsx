'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Camera, Download } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { GALLERY_PRESETS } from '@/lib/data/amenities';
import { useExplorerStore } from '@/lib/store';

export default function Gallery() {
  const captures = useExplorerStore((state) => state.captures);
  const captureRequest = useExplorerStore((state) => state.captureRequest);
  const requestCapture = useExplorerStore((state) => state.requestCapture);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    let timer = 0;
    let index = 0;
    let started = false;
    let disposed = false;
    const nextFrame = () => {
      if (disposed) return;
      const state = useExplorerStore.getState();
      if (state.captureRequest) {
        timer = window.setTimeout(nextFrame, 300);
        return;
      }
      while (index < GALLERY_PRESETS.length && state.captures[GALLERY_PRESETS[index].id]) index += 1;
      if (index >= GALLERY_PRESETS.length) return;
      requestCapture(GALLERY_PRESETS[index]);
      index += 1;
      timer = window.setTimeout(nextFrame, 1200);
    };
    const observer = new IntersectionObserver((entries) => {
      if (started || !entries.some((entry) => entry.isIntersecting)) return;
      started = true;
      observer.disconnect();
      timer = window.setTimeout(nextFrame, 300);
    }, { rootMargin: '400px' });
    observer.observe(element);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [requestCapture]);

  return (
    <section id="gallery" ref={sectionRef} className="section-space scroll-mt-24 bg-bone-deep/60">
      <div className="site-shell">
        <Reveal>
          <div className="flex flex-col justify-between gap-8 border-t border-ink/15 pt-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow flex items-center gap-3"><span className="text-bronze">08 /</span> A closer look</p>
              <h2 className="mt-7 font-display text-[clamp(3rem,6.8vw,6rem)] leading-[0.98] tracking-[-0.055em]">A place with<br /><span className="italic text-bronze">a point of view.</span></h2>
            </div>
            <div className="max-w-[31ch] pb-1">
              <p className="text-[14px] leading-[1.8] text-ink/70">The arrival. The avenues. The little places in between. Explore Aurelia through a collection of views from the live township.</p>
              <a href="#master-plan" className="mt-5 inline-flex items-center gap-3 text-[12px] font-medium text-ink">Find your own perspective <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12 md:gap-y-12">
          {GALLERY_PRESETS.map((preset, index) => {
            const image = captures[preset.id];
            const busy = captureRequest?.preset.id === preset.id;
            const span = index === 0 ? 'md:col-span-8' : index === 1 ? 'md:col-span-4' : index >= 5 ? 'md:col-span-6' : 'md:col-span-4';
            const aspect = index === 0 ? 'aspect-[16/10]' : index === 1 ? 'aspect-[4/3] md:aspect-[4/5]' : 'aspect-[4/3]';
            return (
              <Reveal key={preset.id} delay={(index % 3) * 0.06} className={span}>
                <figure className="group">
                  <div className={`relative ${aspect} overflow-hidden rounded-[18px] bg-[#d9e0cf]`}>
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={`${preset.title}, a view of the Aurelia Estates township`} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[linear-gradient(135deg,#dfe6d5,#b1c1a1)]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/20"><Camera size={20} strokeWidth={1.2} aria-hidden="true" /></div>
                        <span className="eyebrow text-ink/70">{busy ? 'Composing this view…' : 'A new perspective awaits'}</span>
                        <button type="button" onClick={() => requestCapture(preset)} className="text-[12px] underline underline-offset-4">View this scene</button>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-bone/95 px-3 py-2 text-[9px] uppercase tracking-[0.17em] text-ink">{preset.timeOfDay === 'golden' ? 'Golden hour' : 'Daylight'} / {String(index + 1).padStart(2, '0')}</div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button type="button" onClick={() => requestCapture(preset)} disabled={busy} aria-label={`Render ${preset.title} again`} title="Refresh this view" className="flex h-10 w-10 items-center justify-center rounded-full bg-bone/95 text-ink transition-colors hover:bg-lime disabled:opacity-60"><Camera size={15} aria-hidden="true" /></button>
                      {image && <a href={image} download={`aurelia-estates-${preset.id}.jpg`} aria-label={`Download ${preset.title}`} title="Download this view" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-bone transition-colors hover:bg-bronze"><Download size={15} aria-hidden="true" /></a>}
                    </div>
                  </div>
                  <figcaption className="mt-5 flex items-start justify-between gap-5 px-1">
                    <div><h3 className="font-display text-[25px] leading-tight tracking-[-0.025em]">{preset.title}</h3><p className="mt-2 max-w-[48ch] text-[12px] leading-relaxed text-ink/70">{preset.caption}</p></div>
                    <ArrowDown size={15} className="mt-1 shrink-0 text-ink/70" aria-hidden="true" />
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-10 border-t border-ink/12 pt-5 text-[11px] leading-relaxed text-ink/70">Every view is captured from the live 3D model. Architecture and landscape are illustrative.</p>
      </div>
    </section>
  );
}
