import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, MASTER_PLAN_STATS, PLOTS } from '@/lib/data/township';
import { formatINR } from '@/lib/format';
import { GREEN, ROADS, SITE } from '@/lib/data/township';

export const metadata: Metadata = {
  title: 'Master plan sheet — Aurelia Estates',
  description:
    'Printable master-plan sheet for the fictional Aurelia Estates township: block layout, plot schedule, road widths and open space.',
};

export default function BrochurePage() {
  return (
    <div className="min-h-screen bg-white text-[#16211c] print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; }
          .sheet { padding: 0 !important; }
          @page { margin: 14mm; }
        }
      `}</style>

      <div className="no-print border-b border-[#16211c]/15 bg-[#16211c] px-6 py-4 text-[#f5f0e7]">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4">
          <span className="text-[13px]">
            Use your browser’s print dialogue to save this sheet as a PDF.
          </span>
          <Link
            href="/#master-plan"
            className="rounded-sm border border-[#f5f0e7]/40 px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-[#f5f0e7] hover:text-[#16211c]"
          >
            Back to the site
          </Link>
        </div>
      </div>

      <main className="sheet mx-auto max-w-[900px] px-6 py-10">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-[#16211c]/20 pb-6">
          <div>
            <div className="font-serif text-[30px] leading-none">{BRAND.name}</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#a8794a]">
              {BRAND.tagline}
            </div>
          </div>
          <div className="text-right text-[11px] leading-relaxed text-[#16211c]/60">
            <div>Master plan sheet — fictional demonstration</div>
            <div>Issued {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="font-serif text-[26px] leading-tight">Master plan summary</h1>
            <p className="mt-3 max-w-[60ch] text-[12.5px] leading-relaxed text-[#16211c]/70">
              Two residential blocks of five rows by five parcels, separated by a landscaped spine and
              enclosed by a link road on each side. Every parcel fronts a {MASTER_PLAN_STATS.internalRoadWidthM.toFixed(2)} m
              (30 ft) internal carriageway. A single controlled entrance opens onto the{' '}
              {MASTER_PLAN_STATS.arterialWidthM.toFixed(2)} m (60 ft) connective road.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[#16211c]/15 pt-5 text-[12px]">
              {[
                ['Plots', String(MASTER_PLAN_STATS.plotCount)],
                ['Site area', `${MASTER_PLAN_STATS.siteAreaSqm.toLocaleString('en-IN')} m²`],
                ['Site extent', `${SITE.maxX - SITE.minX} m × ${SITE.maxZ - SITE.minZ} m`],
                ['Open space', `${MASTER_PLAN_STATS.openSpacePercent}%`],
                ['Central park', `${MASTER_PLAN_STATS.parkAreaSqm.toLocaleString('en-IN')} m²`],
                ['Play court', `${MASTER_PLAN_STATS.playAreaSqm.toLocaleString('en-IN')} m²`],
                ['Clubhouse', `${MASTER_PLAN_STATS.clubhouseAreaSqm.toLocaleString('en-IN')} m²`],
                ['Internal road area', `${MASTER_PLAN_STATS.roadAreaSqm.toLocaleString('en-IN')} m²`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-[#16211c]/50">{label}</dt>
                  <dd className="tabular-nums text-[13px]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <svg viewBox="0 0 250 202" className="w-full border border-[#16211c]/15" role="img" aria-label="Master plan diagram">
              <rect x={0} y={0} width={250} height={202} fill="#e9e1d2" />
              <rect x={0} y={194} width={250} height={9} fill="#6f6f68" />
              <rect x={20} y={168} width={210} height={9} fill="#8d8d86" />
              <rect x={119.5} y={9} width={9} height={193} fill="#8d8d86" />
              <rect x={11} y={40} width={9} height={128} fill="#8d8d86" />
              <rect x={228} y={40} width={9} height={128} fill="#8d8d86" />
              <rect x={20} y={105} width={210} height={9} fill="#8d8d86" />
              <rect x={20} y={50} width={210} height={9} fill="#8d8d86" />
              <rect x={113.5} y={13} width={21} height={64} fill="#9db07a" />
              <rect x={113.5} y={33} width={21} height={77} fill="#9db07a" />
              {PLOTS.map((plot) => (
                <rect
                  key={plot.id}
                  x={plot.minX + 125}
                  y={198 - plot.maxZ}
                  width={plot.width}
                  height={plot.depth}
                  fill="#f7f2e8"
                  stroke="#8e836a"
                  strokeWidth={0.3}
                />
              ))}
              <text x={60} y={40} fontSize={5} fill="#16211c" letterSpacing={1}>
                BLOCK A
              </text>
              <text x={175} y={40} fontSize={5} fill="#16211c" letterSpacing={1}>
                BLOCK B
              </text>
              <text x={124} y={22} fontSize={4} fill="#16211c" letterSpacing={0.6}>
                CENTRAL PARK
              </text>
              <text x={124} y={100} fontSize={4} fill="#16211c" letterSpacing={0.6}>
                PLAY COURT
              </text>
            </svg>

            <div className="mt-4 text-[10.5px] leading-relaxed text-[#16211c]/55">
              Diagram only — not to scale as a survey. Green belt{' '}
              {(GREEN.beltMaxX - GREEN.beltMinX).toFixed(1)} m wide, spine road {ROADS.spine.width.toFixed(2)} m.
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-[19px]">Plot schedule</h2>
          <table className="mt-3 w-full border-collapse text-left text-[11px]">
            <thead>
              <tr className="border-y border-[#16211c]/25">
                {['Plot', 'Block', 'Area (sq ft)', 'Profile', 'Facing', 'Road', 'Rate / sq ft', 'Price', 'Status'].map(
                  (heading) => (
                    <th key={heading} className="px-2 py-2 text-[9.5px] uppercase tracking-[0.14em] text-[#16211c]/55">
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {PLOTS.map((plot) => (
                <tr key={plot.id} className="border-b border-[#16211c]/10">
                  <td className="tabular-nums px-2 py-1.5">{plot.id}</td>
                  <td className="px-2 py-1.5">{plot.block}</td>
                  <td className="tabular-nums px-2 py-1.5">{plot.areaSqft.toLocaleString('en-IN')}</td>
                  <td className="tabular-nums px-2 py-1.5">
                    {plot.width} × {plot.depth} m
                  </td>
                  <td className="px-2 py-1.5 capitalize">{plot.facing}</td>
                  <td className="px-2 py-1.5">{plot.roadName.split(' · ')[0]}</td>
                  <td className="tabular-nums px-2 py-1.5">
                    ₹{plot.pricePerSqft.toLocaleString('en-IN')}
                  </td>
                  <td className="tabular-nums px-2 py-1.5">{formatINR(plot.price)}</td>
                  <td className="px-2 py-1.5 capitalize">{plot.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="mt-10 border-t border-[#16211c]/20 pt-5 text-[10px] leading-relaxed text-[#16211c]/55">
          Aurelia Estates is a fictional development created for a design and engineering
          demonstration. Prices, availability, geometry, location and amenities are illustrative and
          carry no offer, approval, title, registration or guarantee of any kind. The plan shown is a
          design representation and not a legal survey.
        </footer>
      </main>
    </div>
  );
}
