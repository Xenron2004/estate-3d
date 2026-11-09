'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { AMENITIES } from '@/lib/data/amenities';
import { useExplorerStore } from '@/lib/store';

const FEATURES = [
  { id: 'park', title: 'Take the long way home.', subtitle: 'The central park', description: 'A generous green at the heart of the neighbourhood, with a walking loop, shaded seating and room to slow down.' },
  { id: 'pavilion', title: 'Make the everyday an occasion.', subtitle: 'The garden pavilion', description: 'A glass-fronted conservatory café, a timber pergola and a planted terrace. A natural meeting place, just a walk away.' },
  { id: 'play', title: 'Let little adventures happen.', subtitle: 'The play court', description: 'Swings, soft-surface play and an open lawn make space for the smallest residents to imagine something bigger.' },
  { id: 'apartments', title: 'See life from a new perspective.', subtitle: 'The modern residences', description: 'Five contemporary apartment buildings with generous glazing, recessed balconies and planted roof terraces.' },
];

export default function AmenitiesLifestyle() {
  const [active, setActive] = useState(0);
  const focusAmenity = useExplorerStore((state) => state.focusAmenity);
  const explore = (id: string) => {
    focusAmenity(id);
    document.getElementById('master-plan')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section id="amenities" className="section-space scroll-mt-24 bg-bone-deep/60">
      <div className="site-shell">
        <div className="grid gap-7 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8"><SectionHeading index="03" eyebrow="Life, a little fuller" title={<>Good days,<br /><span className="italic text-bronze">by design.</span></>} /></Reveal>
          <Reveal className="lg:col-span-4" delay={0.08}><p className="max-w-[34ch] text-[15px] leading-[1.8] text-ink/70">The best parts of a neighbourhood aren’t behind your front door. They’re the places that bring you outside.</p></Reveal>
        </div>
        <div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <figure>
              <div className="media-frame aspect-[5/4.6]">
                <Image src="/images/park-path.jpg" alt="Landscape reference of a tree-lined walkway with shaded benches" fill sizes="(max-width: 1024px) 90vw, 53vw" className="object-cover" />
                <div className="absolute bottom-5 left-5 rounded-full bg-bone px-4 py-2 text-[11px] text-ink sm:bottom-7 sm:left-7">More green. More everyday possibilities.</div>
              </div>
              <figcaption className="mt-3 text-[10px] text-ink/70">Landscape inspiration / reference photograph</figcaption>
            </figure>
          </Reveal>
          <div className="lg:col-span-5">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.id} delay={index * 0.04}>
                <article className="border-t border-ink/15">
                  <h3>
                    <button type="button" aria-expanded={active === index} aria-controls={`lifestyle-${feature.id}`} onClick={() => setActive(active === index ? -1 : index)} className="group flex min-h-[105px] w-full items-center gap-5 py-6 text-left">
                      <span className="numeric w-5 shrink-0 self-start pt-1.5 font-sans text-[10px] tracking-normal text-bronze">0{index + 1}</span>
                      <span className="flex-1"><span className="mb-2 block font-sans text-[10px] tracking-[0.12em] text-ink/70 uppercase">{feature.subtitle}</span><span className="block font-display text-[clamp(24px,2.1vw,30px)] leading-[1.12]">{feature.title}</span></span>
                      {active === index ? <Minus size={17} aria-hidden="true" className="shrink-0 text-bronze" /> : <Plus size={17} aria-hidden="true" className="shrink-0 text-ink/70 transition-transform group-hover:rotate-90" />}
                    </button>
                  </h3>
                  <div id={`lifestyle-${feature.id}`} hidden={active !== index} className="pb-7 pl-10">
                    <p className="max-w-[38ch] text-[13px] leading-[1.85] text-ink/70">{feature.description}</p>
                    <button type="button" onClick={() => explore(feature.id)} className="mt-4 inline-flex min-h-10 items-center gap-3 text-[12px] font-medium text-ink">Find it in the township <ArrowUpRight size={16} aria-hidden="true" /></button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/15 pt-6">
            <span className="eyebrow text-ink/70">And a little more</span>
            {AMENITIES.filter((amenity) => ['clubhouse', 'entrance', 'greenbelt'].includes(amenity.id)).map((amenity) => <button key={amenity.id} type="button" onClick={() => explore(amenity.id)} className="group inline-flex min-h-10 items-center gap-3 text-[12px] text-ink/70 transition-colors hover:text-ink">{amenity.name}<ArrowUpRight size={14} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
