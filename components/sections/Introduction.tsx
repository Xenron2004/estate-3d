import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { MASTER_PLAN_STATS } from '@/lib/data/township';

export default function Introduction() {
  return (
    <section id="introduction" className="section-space scroll-mt-24">
      <div className="site-shell grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="relative lg:col-span-6">
          <figure>
            <div className="media-frame aspect-[5/5.4] sm:aspect-[5/4.5] lg:aspect-[5/5.4]">
              <Image src="/images/land-aerial.jpg" alt="Aerial landscape reference of fields bordered by mature trees" fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 rounded-2xl bg-bone p-6 sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <span className="eyebrow text-ink/70">The original plot plan</span>
                  <p className="mt-2 font-display text-[42px] leading-none tracking-[-0.05em]">{MASTER_PLAN_STATS.siteAreaAcres.toFixed(2)} <span className="text-[24px] italic text-bronze">acres</span></p>
                </div>
                <span className="mb-1 max-w-[12ch] text-right text-[11px] leading-relaxed text-ink/70">fifty places to begin</span>
              </div>
            </div>
            <figcaption className="mt-3 flex justify-between gap-4 text-[10px] text-ink/70"><span>Landscape reference / illustrative imagery</span><span>Aurelia Estates</span></figcaption>
          </figure>
        </Reveal>
        <div className="lg:col-span-6 lg:py-8">
          <Reveal delay={0.08}>
            <SectionHeading index="01" eyebrow="The Aurelia way" title={<>A little more space.<br /><span className="italic text-bronze">A different pace.</span></>} />
            <p className="mt-8 max-w-[44ch] text-[15px] leading-[1.85] text-ink/70">A home begins with the place around it. The morning walk. The shade of a tree. The space to make something entirely your own.</p>
            <p className="mt-5 max-w-[44ch] text-[15px] leading-[1.85] text-ink/70">At Aurelia, fifty residential parcels sit around a generous green heart. Connected streets, shared gardens and a new collection of contemporary residences bring the neighbourhood together.</p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-9 grid grid-cols-2 gap-6 border-t border-ink/15 pt-7">
              <div><span className="block font-display text-[27px] leading-tight">Your own canvas</span><span className="mt-2 block text-[12px] text-ink/70">Space for a home with your point of view.</span></div>
              <div><span className="block font-display text-[27px] leading-tight">Shared by nature</span><span className="mt-2 block text-[12px] text-ink/70">A park, a pavilion, a place to belong.</span></div>
            </div>
            <a href="#master-plan" className="button-secondary mt-9">Get to know the neighbourhood <ArrowUpRight size={16} aria-hidden="true" /></a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
