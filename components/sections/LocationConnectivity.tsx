import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';

const FACILITIES = [
  { name: 'District arterial (60 ft)', distance: '0 m', note: 'frontage — the site address' },
  { name: 'Secondary link road', distance: '4.2 km', note: 'illustrative' },
  { name: 'Nearest town centre', distance: '6.5 km', note: 'illustrative' },
  { name: 'School cluster', distance: '3.8 km', note: 'illustrative — not a named institution' },
  { name: 'District hospital', distance: '9.4 km', note: 'illustrative' },
  { name: 'Railway station', distance: '11.2 km', note: 'illustrative' },
  { name: 'Airport access road', distance: '18.6 km', note: 'illustrative' },
];

export default function LocationConnectivity() {
  return (
    <section id="location" className="scroll-mt-24 bg-bone px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionHeading
                index="07"
                eyebrow="Location & connectivity"
                title={
                  <>
                    On the arterial, <span className="italic text-bronze">off the noise.</span>
                  </>
                }
                intro="Aurelia sits behind a single gated edge off a 60 ft road, so the township reads as a quiet enclave while still holding a direct connection to the wider network."
              />
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-10 border-t border-ink/12">
                {FACILITIES.map((facility) => (
                  <div
                    key={facility.name}
                    className="flex items-baseline justify-between gap-6 border-b border-ink/12 py-3.5"
                  >
                    <div>
                      <div className="text-[14px] text-ink">{facility.name}</div>
                      <div className="text-[11px] text-ink/45">{facility.note}</div>
                    </div>
                    <div className="numeric text-[14px] text-ink/70">{facility.distance}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-8 rounded-sm border border-ink/12 bg-bone-deep/60 p-5 text-[12.5px] leading-relaxed text-ink/60">
                <strong className="font-medium text-ink/80">Illustrative geography.</strong> The map
                and every distance above are placeholders created for this demonstration. They do not
                describe a real location, a surveyed route, a verified travel time or a named
                institution, and they must not be used for any decision.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.06}>
              <div className="overflow-hidden rounded-sm border border-ink/12 bg-sand">
                <svg
                  viewBox="0 0 800 520"
                  className="h-auto w-full"
                  role="img"
                  aria-label="Illustrative schematic map showing Aurelia Estates set back from a 60 ft arterial"
                >
                  <rect width="800" height="520" fill="#e3dac6" />
                  {/* fields */}
                  {[
                    [0, 0, 250, 160],
                    [560, 0, 240, 120],
                    [0, 300, 200, 220],
                    [620, 330, 180, 190],
                  ].map(([x, y, w, h], index) => (
                    <rect
                      key={index}
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={index % 2 === 0 ? '#c8c39a' : '#b7bd8e'}
                      opacity={0.75}
                    />
                  ))}
                  {/* arterial */}
                  <rect x={0} y={430} width={800} height={54} fill="#4a4a45" />
                  <line x1={0} y1={457} x2={800} y2={457} stroke="#e8e3d4" strokeWidth={2} strokeDasharray="18 14" />
                  <text x={28} y={420} fill="#2c3930" fontSize={13} letterSpacing={2}>
                    60 FT CONNECTIVE ROAD
                  </text>
                  {/* connector */}
                  <rect x={372} y={120} width={40} height={310} fill="#4a4a45" />
                  {/* ring */}
                  <rect x={300} y={60} width={420} height={250} fill="none" stroke="#6d6d66" strokeWidth={7} />
                  {/* site */}
                  <rect x={392} y={150} width={190} height={160} fill="#8b9c68" stroke="#2c3930" strokeWidth={2} />
                  <rect x={392} y={150} width={190} height={160} fill="none" stroke="#a8794a" strokeWidth={3} strokeDasharray="6 5" />
                  <text x={487} y={236} textAnchor="middle" fill="#16211c" fontSize={17} letterSpacing={3}>
                    AURELIA
                  </text>
                  <text x={487} y={258} textAnchor="middle" fill="#16211c" fontSize={17} letterSpacing={3}>
                    ESTATES
                  </text>
                  {/* access road */}
                  <line x1={392} y1={300} x2={392} y2={430} stroke="#4a4a45" strokeWidth={22} />
                  {/* landmarks */}
                  {[
                    { x: 170, y: 150, label: 'School cluster' },
                    { x: 640, y: 210, label: 'Town centre' },
                    { x: 690, y: 400, label: 'Hospital' },
                    { x: 150, y: 470, label: 'Railway' },
                  ].map((point) => (
                    <g key={point.label}>
                      <circle cx={point.x} cy={point.y} r={6} fill="#16211c" />
                      <circle cx={point.x} cy={point.y} r={13} fill="none" stroke="#16211c" strokeWidth={1} opacity={0.4} />
                      <text x={point.x + 20} y={point.y + 4} fill="#16211c" fontSize={12}>
                        {point.label}
                      </text>
                    </g>
                  ))}
                  <text x={28} y={36} fill="#5d6a5f" fontSize={11} letterSpacing={3}>
                    SCHEMATIC — ILLUSTRATIVE ONLY
                  </text>
                </svg>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-4 text-[11.5px] leading-relaxed text-ink/45">
                In a production build this panel would carry a licensed map provider embed with the
                same coordinates as the 3D model. It is drawn here as an honest placeholder rather
                than a fabricated satellite view.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
