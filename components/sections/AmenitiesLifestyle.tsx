'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { AMENITIES } from '@/lib/data/amenities';
import { useExplorerStore } from '@/lib/store';

const FEATURED = ['park', 'play', 'clubhouse', 'entrance'];

export default function AmenitiesLifestyle() {
  const focusAmenity = useExplorerStore((state) => state.focusAmenity);
  const featured = AMENITIES.filter((amenity) => FEATURED.includes(amenity.id));

  return (
    <section id="amenities" className="scroll-mt-24 bg-bone-deep px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading
            index="05"
            eyebrow="Amenities & lifestyle"
            title={
              <>
                The ground between the <span className="italic text-bronze">blocks.</span>
              </>
            }
            intro="Land is usually sold as numbers. What you actually buy is a daily experience — the walk to the gate, the shade at noon, the play court within sight of the kitchen window. Each amenity below is a real object in the 3D model, at a real coordinate."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <figure className="relative">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-sand">
                <Image
                  src="/images/park-path.jpg"
                  alt="Reference photograph of a shaded park walkway with benches"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[11px] text-ink/45">
                Reference imagery — the park itself is modelled, not photographed.
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-5 lg:pt-6">
            <div className="border-t border-ink/12">
              {featured.map((amenity, index) => (
                <Reveal key={amenity.id} delay={index * 0.05}>
                  <article className="border-b border-ink/12 py-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-[22px] leading-tight text-ink">
                        {amenity.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          focusAmenity(amenity.id);
                          document
                            .getElementById('master-plan')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="group flex shrink-0 items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-ink/55 transition-colors hover:text-ink"
                      >
                        Explore
                        <ArrowUpRight
                          size={13}
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </button>
                    </div>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/65">
                      {amenity.detail}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                      {amenity.facts.map((fact) => (
                        <div key={fact.label}>
                          <span className="eyebrow text-ink/40">{fact.label}</span>
                          <span className="numeric ml-2 text-[12.5px] text-ink/70">{fact.value}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={0.08}>
          <div className="mt-14 grid gap-px overflow-hidden border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
            {AMENITIES.filter((amenity) => !FEATURED.includes(amenity.id)).map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => {
                  focusAmenity(amenity.id);
                  document
                    .getElementById('master-plan')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group bg-bone-deep p-6 text-left transition-colors hover:bg-bone"
              >
                <div className="eyebrow text-ink/40">{amenity.category}</div>
                <h3 className="mt-3 font-display text-[19px] leading-tight text-ink">{amenity.name}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/60">{amenity.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-bronze">
                  Explore in 3D
                  <ArrowUpRight
                    size={13}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
