'use client';

import { useState } from 'react';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const FAQS = [
  { q: 'How much room will I have?', a: 'The master plan offers three plot sizes, all with a 13 m frontage: approximately 3,918 sq ft, 3,498 sq ft and 3,078 sq ft. Open a plot in the explorer to see its exact dimensions, orientation and position in the township.' },
  { q: 'How do I find an available plot?', a: 'Use the availability filters in the master plan or plot collection. Each parcel is marked available, booked or sold, with a matching label and pattern. Select any plot to see its dimensions and demonstration price.' },
  { q: 'Can I imagine a home on my plot?', a: 'Yes. Select a parcel in the 3D explorer, then choose a single-storey or double-storey house preview. These are illustrative concepts placed to scale, rather than approved building plans.' },
  { q: 'What is included in the township?', a: 'The design includes internal roads, walking paths, a landscaped central park, a play court, a clubhouse and a garden pavilion. A connected northern extension adds five modern apartment buildings with shared gardens and planted roof terraces.' },
  { q: 'How do I arrange a conversation or visit?', a: 'Choose a plot and send an enquiry with a preferred date, or open the WhatsApp link with your selected plot already in the message. This is a demonstration: no real site visit, email or SMS is booked.' },
  { q: 'What do the displayed prices include?', a: 'Prices are illustrative parcel values, shown as a rate per square foot and a total. They exclude registration, stamp duty, taxes, legal fees and construction. They are demonstration figures and do not constitute an offer.' },
  { q: 'Can I explore on my phone?', a: 'Yes. The township supports touch controls, plot selection and house previews on compatible devices. If the 3D scene cannot run in your browser, the plot collection and enquiry form remain available.' },
  { q: 'Is Aurelia Estates a real development?', a: 'Aurelia Estates is a fictional township created as a design exploration. Locations, prices, distances and availability are illustrative. This experience makes no claim about title, planning approvals, RERA registration or investment returns.' },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section-space scroll-mt-24 bg-bone">
      <div className="site-shell">
        <div className="grid gap-12 border-t border-ink/15 pt-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow flex items-center gap-3"><span className="text-bronze">09 /</span> A few good questions</p>
              <h2 className="mt-7 max-w-[10ch] font-display text-[clamp(2.8rem,5.3vw,4.8rem)] leading-[1.02] tracking-[-0.05em]">Before you<br /><span className="italic text-bronze">picture yourself here.</span></h2>
              <p className="mt-6 max-w-[31ch] text-[14px] leading-[1.8] text-ink/70">The details that help you see the bigger picture.</p>
              <a href="#contact" className="mt-8 inline-flex items-center gap-4 border-b border-ink/30 pb-2 text-[12px] font-medium text-ink transition-colors hover:text-bronze">Still curious? Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
            </Reveal>
          </div>
          <div className="lg:col-span-8 lg:pt-1">
            {FAQS.map((item, index) => {
              const isOpen = open === index;
              return (
                <Reveal key={item.q} delay={(index % 3) * 0.035}>
                  <div className={`border-b border-ink/15 transition-colors ${isOpen ? 'bg-white/45' : ''}`}>
                    <h3>
                      <button type="button" onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`faq-panel-${index}`} id={`faq-trigger-${index}`} className="group flex w-full items-start gap-4 px-3 py-6 text-left sm:gap-6 sm:px-5 sm:py-7">
                        <span className="numeric pt-1 text-[10px] text-bronze">{String(index + 1).padStart(2, '0')}</span>
                        <span className="flex-1 font-sans text-[15px] font-medium leading-[1.5] tracking-[-0.02em] text-ink sm:text-[17px]">{item.q}</span>
                        <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-ink text-lime' : 'border border-ink/20 text-ink group-hover:bg-lime'}`}>{isOpen ? <Minus size={15} /> : <Plus size={15} />}</span>
                      </button>
                    </h3>
                    <div id={`faq-panel-${index}`} role="region" aria-labelledby={`faq-trigger-${index}`} hidden={!isOpen} className="pb-7 pl-10 pr-7 sm:pl-[3.8rem] sm:pr-16">
                      <p className="max-w-[67ch] text-[13px] leading-[1.9] text-ink/70 sm:text-[14px]">{item.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
