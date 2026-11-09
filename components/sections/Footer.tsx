import Link from 'next/link';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { BRAND } from '@/lib/data/township';

const ANCHORS = [
  { href: '#introduction', label: 'The vision' },
  { href: '#master-plan', label: 'Explore in 3D' },
  { href: '#amenities', label: 'Life at Aurelia' },
  { href: '#plots', label: 'Find your plot' },
  { href: '#location', label: 'The neighbourhood' },
  { href: '#gallery', label: 'In perspective' },
];

export default function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-bone/15 bg-ink text-bone">
      <div className="site-shell pt-14 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-lime">A little more room for life.</p>
            <p className="mt-5 max-w-[30ch] font-display text-[30px] leading-[1.25] tracking-[-0.025em] text-bone/90">Good ground.<br />Beautiful possibilities.</p>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow text-bone/65">Explore Aurelia</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[12px] text-bone/75">
              {ANCHORS.map((anchor) => <li key={anchor.href}><a href={anchor.href} className="link-underline transition-colors hover:text-lime">{anchor.label}</a></li>)}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow text-bone/65">Say hello</p>
            <a href="#contact" className="mt-5 inline-flex items-center gap-3 text-[15px] text-bone transition-colors hover:text-lime">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></a>
            <p className="mt-3 text-[12px] text-bone/60">{BRAND.email}</p>
            <p className="mt-2 text-[11px] text-bone/65">Contact details are illustrative.</p>
          </div>
        </div>
        <div className="relative mt-16 flex items-end justify-between border-b border-bone/20 pb-6 sm:mt-24 sm:pb-10">
          <div className="min-w-0"><p className="font-display text-[clamp(3.7rem,16vw,16rem)] leading-[0.8] tracking-[-0.075em]">Aurelia<span className="text-lime">.</span></p><p className="mt-6 text-[9px] uppercase tracking-[0.5em] text-bone/65 sm:mt-8 sm:text-[11px]">Estates / Your land. Your legacy.</p></div>
          <a href="#top" aria-label="Back to top" className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors hover:border-lime hover:bg-lime hover:text-ink sm:h-16 sm:w-16"><ArrowUp size={20} strokeWidth={1.2} aria-hidden="true" /></a>
        </div>
        <div className="flex flex-col justify-between gap-4 py-7 text-[11px] text-bone/65 md:flex-row">
          <p>© {new Date().getFullYear()} Aurelia Estates. A design exploration.</p>
          <div className="flex flex-wrap gap-6"><Link href="/privacy" className="link-underline hover:text-bone">Privacy notice</Link><Link href="/brochure" className="link-underline hover:text-bone">Printable master plan</Link><a href="#faq" className="link-underline hover:text-bone">Questions & answers</a></div>
        </div>
        <p className="max-w-[112ch] pb-8 text-[10px] leading-[1.7] text-bone/65">Aurelia Estates is a fictional development. Prices, availability, geography and amenities are illustrative. Nothing on this site is an offer, planning approval, title or ownership claim. The 3D model is a design representation, not a legal survey.</p>
      </div>
    </footer>
  );
}
