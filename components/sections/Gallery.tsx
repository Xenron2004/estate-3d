'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Download } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { GALLERY_PRESETS } from '@/lib/data/amenities';
import { useExplorerStore } from '@/lib/store';

export default function Gallery() {
  const captures = useExplorerStore((state) => state.captures);
  const requestCapture = useExplorerStore((state) => state.requestCapture);
  const captureRequest = useExplorerStore((state) => state.captureRequest);
  const started = useRef(false);
  const [busy, setBusy] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (started.current) return;
        started.current = true;
        let index = 0;
        let timer = 0;
        const tick = () => {
          if (index >= GALLERY_PRESETS.length) return;
          const preset = GALLERY_PRESETS[index];
          index += 1;
          requestCapture(preset);
          timer = window.setTimeout(tick, 2800);
        };
        timer = window.setTimeout(tick, 600);
        void timer;
      },
      { rootMargin: '400px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [requestCapture]);

  useEffect(() => {
    if (captureRequest) setBusy(captureRequest.preset.id);
    else setBusy(null);
  }, [captureRequest]);

  return (
    <section id="gallery" ref={sectionRef} className="scroll-mt-24 bg-bone-deep px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading
            index="10"
            eyebrow="Gallery"
            title={
              <>
                Rendered from the model, <span className="italic text-bronze">not the internet.</span>
              </>
            }
            intro="Every frame below is captured live from the interactive 3D township — the same geometry, the same camera, the same light. Nothing here is a stock photograph of somewhere else."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_PRESETS.map((preset, index) => {
            const image = captures[preset.id];
            return (
              <Reveal key={preset.id} delay={index * 0.05}>
                <figure className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink/12 bg-bone">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={`${preset.title} — captured from the Aurelia Estates 3D model`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,#cfc2a4,#a9b184_55%,#8e9b7a)]">
                        <span className="eyebrow text-ink/45">
                          {busy === preset.id ? 'Rendering view…' : 'Awaiting render'}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => requestCapture(preset)}
                      className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-sm border border-ink/20 bg-bone/90 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ink/70 opacity-0 transition-opacity hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <Camera size={12} aria-hidden="true" />
                      Re-render
                    </button>
                  </div>
                  <figcaption className="flex flex-1 flex-col justify-between gap-2 p-5">
                    <div>
                      <div className="font-display text-[19px] leading-tight text-ink">{preset.title}</div>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/55">{preset.caption}</p>
                    </div>
                    {image && (
                      <a
                        href={image}
                        download={`aurelia-estates-${preset.id}.jpg`}
                        className="mt-2 inline-flex w-fit items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-ink/45 transition-colors hover:text-ink"
                      >
                        <Download size={12} aria-hidden="true" />
                        Download frame
                      </a>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
