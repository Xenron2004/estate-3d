import Reveal from '@/components/ui/Reveal';
import { MASTER_PLAN_STATS } from '@/lib/data/township';

const HIGHLIGHTS = [
  { value: String(MASTER_PLAN_STATS.plotCount), suffix: '', label: 'Places to begin', detail: 'Individual residential plots' },
  { value: '30', suffix: 'ft', label: 'Room to move', detail: 'Planned internal roads' },
  { value: String(MASTER_PLAN_STATS.openSpacePercent), suffix: '%', label: 'Space to breathe', detail: 'Open space in the original plan' },
  { value: '05', suffix: '', label: 'A new perspective', detail: 'New contemporary apartment blocks' },
];

export default function Highlights() {
  return (
    <section id="highlights" className="pb-4 pt-1 sm:pb-8" aria-label="Aurelia at a glance">
      <div className="site-shell">
        <div className="overflow-hidden rounded-[24px] bg-ink px-7 py-10 text-bone sm:px-10 sm:py-12">
          <div className="mb-10 flex items-center justify-between gap-6 border-b border-bone/15 pb-5"><span className="section-kicker text-lime">Considered in every dimension</span><span className="hidden text-[11px] text-bone/65 sm:block">Aurelia, at a glance</span></div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
            {HIGHLIGHTS.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.06}>
                <div className={index > 0 ? 'lg:border-l lg:border-bone/15 lg:pl-8' : ''}>
                  <p className="numeric font-display text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-[-0.06em]">{item.value}<span className="ml-1.5 text-[0.4em] italic text-lime">{item.suffix}</span></p>
                  <h3 className="mt-5 font-sans text-[13px] font-medium tracking-normal">{item.label}</h3>
                  <p className="mt-1 text-[11px] text-bone/65">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
