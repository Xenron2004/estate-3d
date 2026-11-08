import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { MASTER_PLAN_STATS } from '@/lib/data/township';

const HIGHLIGHTS = [
  {
    value: String(MASTER_PLAN_STATS.plotCount),
    unit: 'titled parcels',
    note: 'Blocks A and B, five rows of five, each with a surveyed boundary and marked footprint.',
  },
  {
    value: `${MASTER_PLAN_STATS.internalRoadWidthM.toFixed(2)} m`,
    unit: 'internal carriageway',
    note: 'Every parcel fronts a 30 ft road with kerbs, footpaths and covered stormwater channels.',
  },
  {
    value: `${MASTER_PLAN_STATS.arterialWidthM.toFixed(2)} m`,
    unit: 'connective road',
    note: 'The 60 ft arterial the township addresses, with a single controlled vehicular entry.',
  },
  {
    value: `${MASTER_PLAN_STATS.openSpacePercent}%`,
    unit: 'open space',
    note: `${MASTER_PLAN_STATS.openSpaceSqm.toLocaleString('en-IN')} m² of park, play court, planting and verges.`,
  },
];

export default function Highlights() {
  return (
    <section id="highlights" className="scroll-mt-24 bg-ink px-5 py-24 text-bone sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Project highlights"
            tone="dark"
            title={
              <>
                The numbers behind the <span className="italic text-bronze-soft">drawing.</span>
              </>
            }
            intro="Every figure on this page is derived from the master-plan dataset that also generates the 3D model — the same numbers, not a second set of copy."
          />
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, index) => (
            <Reveal key={item.unit} delay={index * 0.06}>
              <div className="h-full bg-ink p-8">
                <div className="numeric font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-bone">
                  {item.value}
                </div>
                <div className="eyebrow mt-3 text-bronze-soft">{item.unit}</div>
                <p className="mt-5 text-[13.5px] leading-relaxed text-bone/60">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[70ch] text-[12.5px] leading-relaxed text-bone/45">
            Planning status: this is a fictional development created to demonstrate interface and
            spatial design. No approval, title, RERA registration or clearance is claimed, implied or
            represented anywhere on this site.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
