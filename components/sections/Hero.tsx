'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react';
import PlanPlaceholder from '@/components/ui/PlanPlaceholder';
import { MASTER_PLAN_STATS } from '@/lib/data/township';

const TownshipCanvas = dynamic(() => import('@/components/three/TownshipCanvas'), {
  ssr: false,
  loading: () => <PlanPlaceholder className="absolute inset-0 h-full w-full" />,
});

const SPECS = [
  { value: `${MASTER_PLAN_STATS.plotCount}`, label: 'Places to call your own' },
  { value: '30 ft', label: 'Tree-lined internal roads' },
  { value: `${MASTER_PLAN_STATS.parkAreaSqm.toLocaleString('en-IN')}`, label: 'Square metres of central park' },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [quality, setQuality] = useState<'high' | 'low'>('low');

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const update = () => setQuality(media.matches ? 'high' : 'low');
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      gsap.from('[data-hero-word]', {
        yPercent: 110,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1,
        delay: 0.1,
      });
      gsap.from('[data-hero-fade]', {
        opacity: 0,
        y: 20,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 0.35,
      });
      gsap.from('[data-hero-stage]', {
        opacity: 0,
        y: 40,
        duration: 1.25,
        ease: 'power3.out',
        delay: 0.5,
      });
    }, root.current);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-title" className="overflow-hidden bg-bone pb-8 pt-28 sm:pb-12 sm:pt-36">
      <div className="site-shell">
        <div className="flex items-center justify-between gap-5 border-t border-ink/15 pt-5">
          <p data-hero-fade className="eyebrow !text-ink/70">Aurelia Estates · A considered way of living</p>
          <span data-hero-fade className="hidden font-mono text-[10px] tracking-[0.1em] text-ink/70 sm:block">LAND / LIFE / POSSIBILITY</span>
        </div>

        <div className="grid gap-7 pb-9 pt-7 lg:grid-cols-[1fr_285px] lg:items-end lg:gap-10 lg:pb-11 lg:pt-8">
          <h1 id="hero-title" className="font-display text-[clamp(2.7rem,8.5vw,8rem)] leading-[0.98] tracking-[-0.065em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-word className="inline-block">Room to live.</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-hero-word className="inline-block italic text-bronze">Space to grow.</span>
            </span>
          </h1>
          <div data-hero-fade className="max-w-[38ch] pb-3">
            <p className="text-[14px] leading-[1.85] text-ink/70 sm:text-[15px]">
              A little more green. A little more freedom. Discover a thoughtfully planned neighbourhood with room for your next chapter.
            </p>
            <a href="#plots" className="group mt-5 inline-flex items-center gap-6 border-b border-ink/30 pb-2 text-[12px] font-medium text-ink transition-colors hover:border-bronze hover:text-bronze">
              Find your place
              <ArrowUpRight size={17} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div data-hero-stage className="relative isolate h-[350px] overflow-hidden rounded-[20px] bg-[#dfe5d3] sm:h-[420px] sm:rounded-[28px] lg:h-[430px] xl:h-[460px]">
          <div className="pointer-events-none absolute inset-0">
            <TownshipCanvas variant="hero" quality={quality} className="h-full w-full" />
          </div>
          <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2.5 rounded-full border border-white/60 bg-bone/95 px-3.5 py-2.5 sm:left-6 sm:top-6">
            <span className="h-1.5 w-1.5 rounded-full bg-moss" />
            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-ink sm:text-[10px]">A neighbourhood, brought to life</span>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 hidden max-w-[175px] rounded-xl bg-ink/95 px-4 py-3 text-bone min-[360px]:block sm:bottom-6 sm:left-6 sm:max-w-none sm:px-5 sm:py-3.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-bone/60">The Aurelia master plan</p>
            <p className="mt-1 text-[12px] font-medium sm:text-[13px]">Fifty plots. One shared vision.</p>
          </div>
          <a href="#master-plan" aria-label="Explore the interactive 3D township" className="group absolute bottom-4 right-4 flex h-[106px] w-[106px] flex-col items-center justify-center gap-2 rounded-full border-[5px] border-bone bg-ink text-bone transition-colors duration-300 hover:bg-lime hover:text-ink sm:bottom-6 sm:right-6 sm:h-[124px] sm:w-[124px]">
            <MoveUpRight size={28} strokeWidth={1.25} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            <span className="text-center text-[9px] font-medium uppercase leading-[1.5] tracking-[0.15em]">Explore<br />the township</span>
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-7 sm:mt-8">
          <dl className="grid flex-1 grid-cols-3 gap-3 sm:max-w-[720px] sm:gap-9">
            {SPECS.map((spec, index) => (
              <div key={spec.label} className={index > 0 ? 'border-l border-ink/15 pl-4 sm:pl-8' : ''}>
                <dd className="numeric font-display text-[27px] leading-none tracking-[-0.04em] text-ink sm:text-[36px]">{spec.value}</dd>
                <dt className="mt-2 max-w-[17ch] text-[9px] leading-[1.6] text-ink/70 sm:text-[11px]">{spec.label}</dt>
              </div>
            ))}
          </dl>
          <a href="#introduction" className="group hidden items-center gap-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-ink/70 transition-colors hover:text-ink lg:flex">
            A life with more room
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 transition-colors group-hover:bg-ink group-hover:text-bone"><ArrowDown size={14} aria-hidden="true" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
