'use client';

import { Download, FileText } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { GREEN, MASTER_PLAN_STATS, PLOTS, ROADS, SITE } from '@/lib/data/township';

const INFRASTRUCTURE = [
  {
    title: 'Carriageways & kerbs',
    body: `All internal roads are ${MASTER_PLAN_STATS.internalRoadWidthM.toFixed(2)} m (30 ft) wide with kerbed edges, a 1.6 m footpath on each side and a covered stormwater channel between kerb and footpath.`,
  },
  {
    title: 'Drainage',
    body: 'Surface water is carried along the road edges in covered channels and collected at a detention point at the north-east corner, away from every parcel.',
  },
  {
    title: 'Power & lighting',
    body: 'Street lighting is set at 22–26 m intervals on every internal road, with a utility corridor and cross-arms for distribution along the eastern link road.',
  },
  {
    title: 'Water distribution',
    body: 'A distribution main is shown running under the spine road with service connections available to each plot at the time of construction.',
  },
  {
    title: 'Boundaries',
    body: `The compound is enclosed by a 1.9 m wall with piers at 6 m centres, broken only at the single controlled entrance. Every parcel carries a marked footprint and boundary line.`,
  },
];

function downloadCsv() {
  const header = ['Plot ID', 'Block', 'Area (sq ft)', 'Width (m)', 'Depth (m)', 'Facing', 'Road', 'Price (INR)', 'Rate/sq ft', 'Status'];
  const rows = PLOTS.map((plot) => [
    plot.id,
    plot.block,
    plot.areaSqft,
    plot.width,
    plot.depth,
    plot.facing,
    plot.roadName,
    plot.price,
    plot.pricePerSqft,
    plot.status,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'aurelia-estates-plot-schedule.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function MasterPlanDetails() {
  return (
    <section id="plan-details" className="scroll-mt-24 bg-bone px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading
            index="08"
            eyebrow="Master plan details"
            title={
              <>
                How the land is <span className="italic text-bronze">actually organised.</span>
              </>
            }
            intro="Two blocks of five rows by five parcels, separated by a landscaped spine and bound by a link road on each side. Everything below is read directly from the configuration that drives the model."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="overflow-hidden rounded-sm border border-ink/12 bg-sand p-4">
                <svg
                  viewBox="0 0 250 202"
                  className="h-auto w-full"
                  role="img"
                  aria-label="Diagram of the block layout, roads and open space"
                >
                  <rect x={0} y={0} width={250} height={202} fill="#e6ddc9" />
                  {/* roads */}
                  <rect x={0} y={194} width={250} height={9} fill="#8d8d86" />
                  <rect x={20} y={168} width={210} height={9} fill="#8d8d86" />
                  <rect x={119.5} y={9} width={9} height={193} fill="#8d8d86" />
                  <rect x={11} y={40} width={9} height={128} fill="#8d8d86" />
                  <rect x={228} y={40} width={9} height={128} fill="#8d8d86" />
                  <rect x={20} y={105} width={210} height={9} fill="#8d8d86" />
                  <rect x={20} y={50} width={210} height={9} fill="#8d8d86" />
                  {/* green spine */}
                  <rect x={113.5} y={33} width={21} height={77} fill="#9db07a" />
                  <rect x={113.5} y={13} width={21} height={64} fill="#9db07a" />
                  {/* blocks */}
                  {PLOTS.map((plot) => (
                    <rect
                      key={plot.id}
                      x={plot.minX + 125}
                      y={198 - plot.maxZ}
                      width={plot.width}
                      height={plot.depth}
                      fill="#f2ead9"
                      stroke="#9c927a"
                      strokeWidth={0.3}
                    />
                  ))}
                  <text x={60} y={40} fontSize={5} fill="#2c3930" letterSpacing={1}>
                    BLOCK A
                  </text>
                  <text x={175} y={40} fontSize={5} fill="#2c3930" letterSpacing={1}>
                    BLOCK B
                  </text>
                  <text x={124} y={20} fontSize={4} fill="#2c3930" letterSpacing={0.6}>
                    CENTRAL PARK
                  </text>
                  <text x={124} y={100} fontSize={4} fill="#2c3930" letterSpacing={0.6}>
                    PLAY COURT
                  </text>
                  <text x={18} y={196} fontSize={4} fill="#f2ead9" letterSpacing={0.6}>
                    60 FT CONNECTIVE ROAD
                  </text>
                </svg>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-8 overflow-hidden border border-ink/12">
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">Plot size bands</caption>
                  <thead>
                    <tr className="border-b border-ink/12 bg-bone-deep/60">
                      <th scope="col" className="px-4 py-3 text-[10.5px] uppercase tracking-[0.16em] text-ink/50">
                        Size band
                      </th>
                      <th scope="col" className="px-4 py-3 text-[10.5px] uppercase tracking-[0.16em] text-ink/50">
                        Area
                      </th>
                      <th scope="col" className="px-4 py-3 text-[10.5px] uppercase tracking-[0.16em] text-ink/50">
                        Profile
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-[10.5px] uppercase tracking-[0.16em] text-ink/50">
                        Plots
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {MASTER_PLAN_STATS.sizeBands.map((band) => (
                      <tr key={band.label}>
                        <td className="px-4 py-3 text-[13.5px] text-ink">{band.label}</td>
                        <td className="numeric px-4 py-3 text-[13px] text-ink/70">
                          {band.areaSqft.toLocaleString('en-IN')} sq ft
                        </td>
                        <td className="px-4 py-3 text-[13px] text-ink/55">{band.note}</td>
                        <td className="numeric px-4 py-3 text-right text-[13px] text-ink/70">{band.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.08}>
              <dl className="grid grid-cols-2 gap-px overflow-hidden border border-ink/12 bg-ink/12">
                {[
                  { label: 'Site area', value: `${MASTER_PLAN_STATS.siteAreaSqm.toLocaleString('en-IN')} m²` },
                  { label: 'Site extent', value: `${SITE.maxX - SITE.minX} m × ${SITE.maxZ - SITE.minZ} m` },
                  { label: 'Plot coverage', value: `${Math.round((MASTER_PLAN_STATS.plotAreaSqm / MASTER_PLAN_STATS.siteAreaSqm) * 100)}%` },
                  { label: 'Open space', value: `${MASTER_PLAN_STATS.openSpacePercent}%` },
                  { label: 'Park', value: `${MASTER_PLAN_STATS.parkAreaSqm.toLocaleString('en-IN')} m²` },
                  { label: 'Play court', value: `${MASTER_PLAN_STATS.playAreaSqm.toLocaleString('en-IN')} m²` },
                  { label: 'Clubhouse', value: `${MASTER_PLAN_STATS.clubhouseAreaSqm.toLocaleString('en-IN')} m²` },
                  { label: 'Internal road area', value: `${MASTER_PLAN_STATS.roadAreaSqm.toLocaleString('en-IN')} m²` },
                ].map((item) => (
                  <div key={item.label} className="bg-bone p-4">
                    <dt className="eyebrow text-ink/45">{item.label}</dt>
                    <dd className="numeric mt-1.5 text-[15px] text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 border-t border-ink/12">
                {INFRASTRUCTURE.map((item) => (
                  <div key={item.title} className="border-b border-ink/12 py-5">
                    <h3 className="font-display text-[18px] leading-tight text-ink">{item.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">{item.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-8 rounded-sm border border-ink/12 bg-bone-deep/60 p-6">
                <h3 className="font-display text-[20px] text-ink">Take the schedule with you</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
                  Open the printable master-plan sheet and use your browser’s print dialogue to save it
                  as a PDF, or download the full plot schedule as CSV. Both are generated from the
                  live dataset — no static file goes stale.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="/brochure"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-3 text-[10.5px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-bronze"
                  >
                    <FileText size={14} aria-hidden="true" />
                    Printable master plan
                  </a>
                  <button
                    type="button"
                    onClick={downloadCsv}
                    className="inline-flex items-center gap-2 rounded-sm border border-ink/25 px-4 py-3 text-[10.5px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone"
                  >
                    <Download size={14} aria-hidden="true" />
                    Download CSV
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-[80ch] text-[12px] leading-relaxed text-ink/45">
            Road widths used in this model: {Object.values(ROADS)
              .map((road) => `${road.label} (${road.width.toFixed(2)} m)`)
              .join('; ')}. Clubhouse and play areas are drawn to the footprints described above.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
