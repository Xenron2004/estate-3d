import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { MASTER_PLAN_STATS } from '@/lib/data/township';

const OWNERSHIP = [
  {
    title: 'A parcel you can actually shape',
    body: 'Every plot arrives with surveyed boundaries, a marked footprint and a road frontage already fixed — so the only open question is what you build inside it.',
  },
  {
    title: 'Infrastructure that arrives before you do',
    body: 'Carriageways, kerbs, footpaths, drainage, street lighting and power conduits are planned at the master-plan level, not negotiated plot by plot.',
  },
  {
    title: 'Open space you did not have to buy',
    body: 'A landscaped central park, a play court and planted belts belong to the township — shared ground that adds value to a plot you own outright.',
  },
];

export default function Introduction() {
  return (
    <section id="introduction" className="scroll-mt-24 bg-bone px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                index="01"
                eyebrow="Introduction"
                title={
                  <>
                    A Place Designed for <span className="italic text-bronze">Possibilities.</span>
                  </>
                }
              />
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-10 space-y-5 text-[15px] leading-[1.75] text-ink/75">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[64px] first-letter:leading-[0.78] first-letter:text-ink">
                  Buying land is an act of patience. You are not buying a finished object; you are
                  buying the right to decide, later, what the object should be. Aurelia Estates is
                  planned around that idea — fifty parcels laid out with the discipline of a survey and
                  the restraint of a good architect.
                </p>
                <p>
                  The township is a closed, low-density composition of two residential blocks facing a
                  landscaped spine. Roads are 30 ft with kerbs, footpaths and covered drainage. Plots
                  are back-to-back by design, so no home looks into another home’s courtyard. At the
                  centre, a park and a play court hold the ground between the blocks.
                </p>
                <p>
                  Nothing here is speculative: the geometry you see in the 3D model is generated from
                  the same dataset as the inventory below it. Area, price per square foot and amenity
                  distance on this page are computed, not decorated.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <figure className="mt-12">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-sand">
                  <Image
                    src="/images/land-aerial.jpg"
                    alt="Aerial reference photograph of cultivated land divided by informal tracks"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-[11px] leading-relaxed text-ink/50">
                  Reference imagery only — cultivated land being read as a plot. The township itself
                  is shown in the live 3D model.
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-24">
            <Reveal delay={0.1}>
              <blockquote className="border-l-2 border-bronze pl-6">
                <p className="font-display text-[clamp(1.5rem,2.5vw,2.15rem)] leading-[1.25] text-ink">
                  “Own the land, and the house becomes a decision rather than a compromise.”
                </p>
                <footer className="mt-4 text-[11px] uppercase tracking-[0.2em] text-ink/45">
                  Aurelia Estates · design note
                </footer>
              </blockquote>
            </Reveal>

            <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
              {OWNERSHIP.map((item, index) => (
                <Reveal key={item.title} delay={0.08 * index}>
                  <div className="grid grid-cols-[3.2rem_1fr] gap-4 py-7">
                    <span className="eyebrow numeric pt-1 text-bronze">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-[21px] leading-snug text-ink">{item.title}</h3>
                      <p className="mt-2.5 text-[14px] leading-relaxed text-ink/65">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
                {[
                  { value: MASTER_PLAN_STATS.siteAreaAcres.toFixed(2), label: 'acres, master plan' },
                  { value: `${MASTER_PLAN_STATS.openSpacePercent}%`, label: 'kept as open space' },
                  { value: `${MASTER_PLAN_STATS.sizeBands.length}`, label: 'plot size bands' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="numeric font-display text-[38px] leading-none text-ink">
                      {stat.value}
                    </div>
                    <div className="eyebrow mt-2 text-ink/45">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
