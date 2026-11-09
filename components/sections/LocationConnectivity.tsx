import { ArrowUpRight, MapPin } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const FACILITIES = [
  { name: 'The 60 ft connective road', distance: 'At your doorstep' },
  { name: 'School cluster', distance: '3.8 km' },
  { name: 'Secondary link road', distance: '4.2 km' },
  { name: 'Town centre', distance: '6.5 km' },
  { name: 'District hospital', distance: '9.4 km' },
  { name: 'Railway station', distance: '11.2 km' },
  { name: 'Airport access road', distance: '18.6 km' },
];

export default function LocationConnectivity() {
  return (
    <section id="location" className="section-space scroll-mt-24 bg-bone">
      <div className="site-shell">
        <Reveal>
          <div className="flex flex-col justify-between gap-7 border-t border-ink/15 pt-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow flex items-center gap-3"><span className="text-bronze">05 /</span> Connected, naturally</p>
              <h2 className="mt-7 font-display text-[clamp(3rem,6.2vw,5.6rem)] leading-[1.01] tracking-[-0.05em]">Away from the rush.<br /><span className="italic text-bronze">Close to your world.</span></h2>
            </div>
            <p className="max-w-[33ch] pb-1 text-[14px] leading-[1.8] text-ink/70">A quiet address behind a landscaped edge, with a direct connection to the 60 ft road beyond.</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[22px] border border-ink/10 bg-[#e5eadd]">
                <svg viewBox="0 0 760 590" className="h-auto w-full" role="img" aria-label="Illustrative location diagram of Aurelia Estates, a school cluster, town centre and connective road. Not a real map.">
                  <defs>
                    <pattern id="location-grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M38 0H0V38" fill="none" stroke="#162c25" strokeOpacity="0.045" /></pattern>
                  </defs>
                  <rect width="760" height="590" fill="#e5eadd" />
                  <rect width="760" height="590" fill="url(#location-grid)" />
                  <path d="M-40 50Q130-30 190 70T260 220T80 300T-40 430Z" fill="#c8d3bb" />
                  <path d="M630-30Q560 100 650 160T740 330T820 380V-30Z" fill="#c8d3bb" />
                  <path d="M-20 380L250 340L380 375L600 355L790 310" fill="none" stroke="#f6f7f1" strokeWidth="22" />
                  <path d="M180-30L225 190L186 350L240 610" fill="none" stroke="#f6f7f1" strokeWidth="22" />
                  <path d="M570-20L558 190L600 360L560 610" fill="none" stroke="#f6f7f1" strokeWidth="18" />
                  <path d="M-20 108L300 112L565 87L790 112" fill="none" stroke="#f6f7f1" strokeWidth="20" />
                  <rect x="290" y="165" width="230" height="225" rx="12" fill="#162c25" />
                  <rect x="306" y="182" width="198" height="191" rx="7" fill="#2f4538" />
                  <path d="M405 183V373M307 245H503M307 309H503" stroke="#d5e6a0" strokeOpacity="0.45" strokeWidth="5" />
                  <rect x="387" y="198" width="36" height="155" rx="17" fill="#d5e6a0" />
                  {[322, 347, 445, 470].map((x) => <g key={x}>{[201, 263, 326].map((y) => <rect key={y} x={x} y={y} width="18" height="29" rx="2" fill="#82967b" />)}</g>)}
                  <path d="M405 390V460" stroke="#162c25" strokeWidth="20" />
                  <path d="M-20 470H780" stroke="#738074" strokeWidth="44" />
                  <path d="M-20 470H780" stroke="#e9eddf" strokeWidth="2" strokeDasharray="15 14" />
                  <rect x="328" y="245" width="154" height="61" rx="30" fill="#f3f3ed" />
                  <text x="405" y="282" textAnchor="middle" fontFamily="Georgia, serif" fontSize="25" fill="#162c25">Aurelia Estates</text>
                  <circle cx="405" cy="410" r="6" fill="#d5e6a0" />
                  <text x="438" y="425" fontFamily="Arial, sans-serif" fontSize="14" fill="#415342">Gated arrival</text>
                  <g transform="translate(108 176)"><circle r="6" fill="#657b4e" /><circle r="16" fill="none" stroke="#657b4e" strokeOpacity="0.4" /><text x="-42" y="38" fill="#415342" fontFamily="Arial, sans-serif" fontSize="17">Schools</text></g>
                  <g transform="translate(636 250)"><circle r="6" fill="#657b4e" /><circle r="16" fill="none" stroke="#657b4e" strokeOpacity="0.4" /><text x="-41" y="38" fill="#415342" fontFamily="Arial, sans-serif" fontSize="17">Town centre</text></g>
                  <text x="34" y="512" fontFamily="Arial, sans-serif" fontSize="15" letterSpacing="2" fill="#415342">60 FT CONNECTIVE ROAD</text>
                  <g transform="translate(698 44)"><path d="M0 25V0M-6 8L0 0L6 8" fill="none" stroke="#415342" strokeWidth="1.5" /><text x="0" y="-10" textAnchor="middle" fill="#415342" fontFamily="Arial, sans-serif" fontSize="11">N</text></g>
                </svg>
                <div className="absolute left-5 top-5 rounded-full bg-bone/95 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-ink/70">A sense of place / Illustrative map</div>
                <a href="#master-plan" className="absolute bottom-5 right-5 inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-[11px] text-bone transition-colors hover:bg-bronze">Explore the master plan <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:pt-2">
            <Reveal delay={0.08}>
              <div className="flex items-center gap-3 pb-5 text-ink"><MapPin size={16} strokeWidth={1.4} aria-hidden="true" /><p className="eyebrow">The neighbourhood, in reach</p></div>
              <div className="border-t border-ink/15">
                {FACILITIES.map((facility, index) => <div key={facility.name} className="flex items-baseline justify-between gap-4 border-b border-ink/12 py-4"><div className="flex items-baseline gap-3"><span className="numeric text-[9px] text-bronze">{String(index + 1).padStart(2, '0')}</span><span className="text-[12px] leading-relaxed text-ink/80">{facility.name}</span></div><span className="numeric shrink-0 text-[12px] text-ink">{facility.distance}</span></div>)}
              </div>
              <p className="mt-6 max-w-[43ch] text-[11px] leading-[1.8] text-ink/70">The map and distances are illustrative, not a real location or a verified route. They are provided solely for this fictional development.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
