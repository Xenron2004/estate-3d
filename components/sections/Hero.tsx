'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import PlanPlaceholder from '@/components/ui/PlanPlaceholder';
import { MASTER_PLAN_STATS } from '@/lib/data/township';

const TownshipCanvas = dynamic(() => import('@/components/three/TownshipCanvas'), {
  ssr: false,
  loading: () => <PlanPlaceholder className="absolute inset-0 h-full w-full" />,
});

const SPECS = [
  { label: 'Plots', value: `${MASTER_PLAN_STATS.plotCount}` },
  { label: 'Internal roads', value: '30 ft' },
  { label: 'Central park', value: `${MASTER_PLAN_STATS.parkAreaSqm.toLocaleString('en-IN')} m²` },
  { label: 'Gated entries', value: '1' },
];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.from('[data-hero-word]', {
        yPercent: 116,
        opacity: 0,
        duration: 1.25,
        ease: 'power4.out',
        stagger: 0.085,
        delay: 0.12,
      });
      gsap.from('[data-hero-fade]', {
        opacity: 0,
        y: 20,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.55,
      });
    }, element);

    return () => context.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[100svh] w-full overflow-hidden bg-sand">
      <div className="pointer-events-none absolute inset-0">
        <TownshipCanvas variant="hero" quality="low" className="h-full w-full" />
      </div>

      {/* legibility scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(245,240,231,0.97)_0%,rgba(245,240,231,0.93)_22%,rgba(245,240,231,0.74)_38%,rgba(245,240,231,0.34)_52%,rgba(245,240,231,0.06)_64%,rgba(245,240,231,0)_74%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bone/85 to-transparent"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-20">
        <div className="max-w-[54rem]">
          <p data-hero-fade className="eyebrow text-ink/60">
            Aurelia Estates · Planned Residential Township
          </p>

          <h1 className="mt-6 font-display text-[clamp(3.1rem,9.6vw,8.6rem)] leading-[0.9] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-word className="inline-block">
                Your Land.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-word className="inline-block italic text-bronze">
                Your Legacy.
              </span>
            </span>
          </h1>

          <p
            data-hero-fade
            className="mt-7 max-w-[46ch] text-[16px] leading-relaxed text-ink/75 sm:text-[17px]"
          >
            Fifty titled parcels, kerbed 30 ft internal roads, a landscaped central park and a single
            controlled entrance on the 60 ft connect — explored parcel by parcel in a live 3D master
            plan.
          </p>

          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#master-plan"
              className="group inline-flex items-center gap-3 rounded-sm bg-ink px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-bone transition-colors hover:bg-bronze"
            >
              Explore Master Plan
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#plots"
              className="inline-flex items-center gap-3 rounded-sm border border-ink/25 px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-ink hover:bg-ink/5"
            >
              View Available Plots
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-8 border-t border-ink/12 pt-6">
          <dl className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
            {SPECS.map((spec) => (
              <div key={spec.label}>
                <dt className="eyebrow text-ink/45">{spec.label}</dt>
                <dd className="numeric mt-1.5 font-display text-[26px] leading-none text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#introduction"
            className="group hidden items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-ink/55 transition-colors hover:text-ink md:flex"
          >
            Scroll
            <ArrowDown
              size={15}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
