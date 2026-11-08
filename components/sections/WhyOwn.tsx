import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';

const REASONS = [
  {
    title: 'Design freedom',
    body: 'With a 13 m frontage and depth from 22 m to 28 m, there is room for a courtyard home, a villa with a garden, or a two-floor build over a double garage — the parcel is the constraint, the architecture is yours.',
  },
  {
    title: 'Outdoor space as part of the asset',
    body: 'Plot depth is the rarest thing in a planned township. Here, a double-frontage edge and a deep rear garden are part of the title, not an afterthought.',
  },
  {
    title: 'Planned access and services',
    body: 'Roads, drainage, lighting and conduits are laid out at master-plan level, so building does not mean renegotiating the basics plot by plot.',
  },
  {
    title: 'A neighbourhood, not an address',
    body: 'Shared park, play court, clubhouse and a single controlled entry mean the land sits inside a place with routines — which is what makes ownership feel durable.',
  },
  {
    title: 'Timing on your side',
    body: 'Buy the land now, build when the plan is ready. Holding a titled parcel in a planned township is a decision you can time to your own life.',
  },
];

export default function WhyOwn() {
  return (
    <section id="why" className="scroll-mt-24 bg-bone-deep px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionHeading
                index="09"
                eyebrow="Why own a plot here"
                title={
                  <>
                    Own the <span className="italic text-bronze">ground</span>, then decide everything
                    above it.
                  </>
                }
                intro="No promise of appreciation, no projected returns, no artificial scarcity. Just the honest reasons a parcel of planned land in a well-made township is worth owning."
              />
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border-t border-ink/12">
              {REASONS.map((reason, index) => (
                <Reveal key={reason.title} delay={index * 0.05}>
                  <article className="grid grid-cols-[2.6rem_1fr] gap-5 border-b border-ink/12 py-8 sm:grid-cols-[3.6rem_1fr] sm:gap-8">
                    <span className="numeric pt-1 font-display text-[15px] text-bronze">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-[clamp(1.35rem,2.3vw,1.9rem)] leading-tight text-ink">
                        {reason.title}
                      </h3>
                      <p className="mt-3 max-w-[62ch] text-[14.5px] leading-[1.7] text-ink/65">
                        {reason.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
