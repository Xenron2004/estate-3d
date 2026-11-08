'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';

const FAQS = [
  {
    q: 'How large are the plots?',
    a: 'Three size bands are planned, all with a 13 m frontage: prime avenue plots of about 3,918 sq ft (364 m², 28 m deep), inner-row plots of about 3,498 sq ft (325 m², 25 m deep) and rear-row plots of about 3,078 sq ft (286 m², 22 m deep). Every parcel in the model and in the inventory comes from the same geometry, so the dimensions you see are the dimensions that are drawn.',
  },
  {
    q: 'Which plots are available right now?',
    a: 'Of the fifty parcels, the current demonstration snapshot shows 34 available, 10 booked and 6 sold. Availability is colour-coded in the 3D model — solid green for available, diagonal amber for booked, cross-hatched red for sold — and each state also carries a pattern and a word so colour is never the only signal. The filters and the inventory update together.',
  },
  {
    q: 'How do I make an enquiry?',
    a: 'Use the enquiry form at the foot of the page, or the WhatsApp button, which opens a chat with your selected plot ID already written into the message. Enquiries submitted here are stored in a demonstration database and are clearly marked as such — no sales team is notified and no email is sent in this build.',
  },
  {
    q: 'Can I visit the site?',
    a: 'Site visits are described in the contact section with a preferred-date field so the enquiry carries your availability. Because this is a fictional development, no real site exists to visit: in a production build the same form would post to a sales CRM and confirm a visit by email and SMS.',
  },
  {
    q: 'What do the prices include?',
    a: 'The figures shown are demonstration prices for a titled parcel in a planned township, expressed as a rate per square foot and a total. They are calculated from the parcel geometry using a notional rate band per row, with a position factor for parcels closest to the central green. They exclude registration, stamp duty, GST, legal fees and construction costs, and they are not an offer.',
  },
  {
    q: 'How does the virtual tour work?',
    a: 'The 3D model is rendered in your browser using WebGL — no video, no pre-rendered fly-through. You can orbit, zoom, switch to a master-plan view, walk the streets at eye level, open any parcel, and preview a conceptual house on it. The same model backs the inventory, the filters and the gallery frames. If WebGL is unavailable the site degrades to the full text inventory and the enquiry form.',
  },
  {
    q: 'Are the roads, utilities and park actually planned?',
    a: 'They are modelled as a coherent plan: 30 ft internal carriageways with kerbs, footpaths and covered drainage, a 60 ft connective road with a single controlled entry, a 1.9 m compound wall, a 4,352 m² central park, a play court and a clubhouse. These are design proposals in a fictional development — they are not evidence of any approval, consent or clearance.',
  },
  {
    q: 'Is this a real project?',
    a: 'No. Aurelia Estates is a fictional township created to demonstrate spatial and interface design. The location, distances, prices, availability and dates are illustrative, and the site makes no claim about ownership, title, RERA registration, approvals, returns or appreciation.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-bone px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionHeading
                index="11"
                eyebrow="Questions"
                title={
                  <>
                    The things people <span className="italic text-bronze">actually ask.</span>
                  </>
                }
                intro="Straight answers, including the ones that say “this is a demonstration”."
              />
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-ink/12">
              {FAQS.map((item, index) => {
                const isOpen = open === index;
                return (
                  <Reveal key={item.q} delay={index * 0.03}>
                    <div className="border-b border-ink/12">
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${index}`}
                          id={`faq-trigger-${index}`}
                          className="flex w-full items-start justify-between gap-6 py-5 text-left"
                        >
                          <span className="font-display text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug text-ink">
                            {item.q}
                          </span>
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink/60"
                          >
                            {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                          </span>
                        </button>
                      </h3>
                      <div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${index}`}
                        hidden={!isOpen}
                        className="pb-6 pr-10"
                      >
                        <p className="max-w-[70ch] text-[14px] leading-[1.75] text-ink/65">{item.a}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
