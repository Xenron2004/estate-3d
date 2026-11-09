import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const REASONS = [
  { title: 'A home with your point of view.', body: 'A courtyard, a garden, a room for something you love. Start with a parcel and explore the possibilities in the home preview.' },
  { title: 'The details, already considered.', body: 'A connected street plan, shared green spaces and a neighbourhood designed as a whole. The setting is part of the idea.' },
  { title: 'Room for whatever comes next.', body: 'Find the dimensions, orientation and surroundings that suit the way you want to live. Then begin with a clearer picture.' },
];

export default function WhyOwn() {
  return (
    <section id="why" className="section-space relative scroll-mt-24 overflow-hidden bg-ink text-bone">
      <div className="site-shell grid gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-6">
          <span className="section-kicker text-lime">A place of your own / 07</span>
          <h2 className="mt-9 font-display text-[clamp(64px,8.7vw,126px)] leading-[0.94] tracking-[-0.06em]">Yours.<br /><span className="italic text-lime">In every sense.</span></h2>
          <p className="mt-8 max-w-[36ch] text-[14px] leading-[1.85] text-bone/65">Some decisions are about more than an address. They’re about the life you make around it.</p>
          <a href="#plots" className="mt-9 inline-flex min-h-12 items-center gap-7 rounded-full bg-lime px-6 py-3 text-[12px] font-medium text-ink transition-colors hover:bg-bone">Find your place <ArrowUpRight size={17} aria-hidden="true" /></a>
        </Reveal>
        <div className="lg:col-span-6 lg:pt-10">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 0.07}>
              <article className="grid grid-cols-[28px_1fr] gap-5 border-t border-bone/20 py-8 sm:gap-8">
                <span className="numeric pt-1.5 text-[10px] text-lime/70">0{index + 1}</span>
                <div><h3 className="font-display text-[clamp(25px,2.4vw,34px)] leading-[1.12] tracking-[-0.035em]">{reason.title}</h3><p className="mt-4 max-w-[42ch] text-[13px] leading-[1.85] text-bone/60">{reason.body}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
