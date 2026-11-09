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
    <section id="plan-details" className="section-space scroll-mt-24">
      <div className="site-shell">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <SectionHeading index="06" eyebrow="Design in the details" title={<>Beautifully planned.<br /><span className="italic text-bronze">Clearly considered.</span></>} />
          </Reveal>
          <Reveal className="lg:col-span-4" delay={0.08}>
            <p className="max-w-[35ch] text-[14px] leading-[1.85] text-ink/70">A closer look at the original plot layout, the spaces between, and the infrastructure that brings it together.</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="overflow-hidden rounded-[24px] bg-bone-deep p-5 sm:p-8">
                <div className="mb-6 flex items-center justify-between text-[10px] tracking-[0.1em] text-ink/70 uppercase"><span>The original plot plan</span><span>50 parcels / A + B</span></div>
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-bone">
                  <svg viewBox="0 0 270 236" className="h-auto w-full" role="img" aria-label="Schematic original plan with fifty parcels, connecting roads and a central green">
                    <rect width="270" height="236" fill="#eef0e6" />
                    <g transform="translate(10 20)">
                      <rect x={GREEN.parkMinX + 125} y={198 - GREEN.parkMaxZ} width={GREEN.parkMaxX - GREEN.parkMinX} height={GREEN.parkMaxZ - GREEN.parkMinZ} rx="2" fill="#adc38c" />
                      <rect x={GREEN.beltMinX + 125} y={198 - GREEN.beltMaxZ} width={GREEN.beltMaxX - GREEN.beltMinX} height={GREEN.beltMaxZ - GREEN.beltMinZ} fill="#becfa4" />
                      {Object.values(ROADS).map((road) => <rect key={road.id} x={road.axis === 'x' ? Math.max(road.from + 125, 0) : road.center + 125 - road.width / 2} y={road.axis === 'x' ? 198 - road.center - road.width / 2 : 198 - road.to} width={road.axis === 'x' ? Math.min(road.to - road.from, 250) : road.width} height={road.axis === 'x' ? road.width : road.to - road.from} fill="#7c8d7c" />)}
                      {PLOTS.map((plot) => <rect key={plot.id} x={plot.minX + 125} y={198 - plot.maxZ} width={plot.width - 0.6} height={plot.depth - 0.6} rx="0.6" fill={plot.block === 'A' ? '#dde6cd' : '#e5e9d9'} stroke="#899b79" strokeWidth="0.4" />)}
                      <rect x={SITE.minX + 125} y={198 - SITE.maxZ} width={SITE.maxX - SITE.minX} height={SITE.maxZ - SITE.minZ} rx="1.5" fill="none" stroke="#30473b" strokeWidth="0.7" />
                      <text x="57" y="110" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#162c25">Block A</text>
                      <text x="193" y="110" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#162c25">Block B</text>
                      <circle cx="125" cy="48" r="5" fill="#f3f3ed" />
                      <path d="M122 49L125 43L128 49ZM123 51L125 47L127 51Z" fill="#657b4e" />
                      <text x="125" y="206" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="3.6" letterSpacing="0.7" fill="#657b4e">60 FT CONNECTIVE ROAD</text>
                    </g>
                    <path d="M252 20V8M249 12L252 8L255 12" fill="none" stroke="#162c25" strokeWidth="0.7" />
                    <text x="252" y="6" textAnchor="middle" fontSize="3.5" fill="#162c25">N</text>
                  </svg>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-[10px] text-ink/70"><span>Schematic illustration / not a legal survey</span><a href="#master-plan" className="inline-flex min-h-9 items-center gap-2 font-medium text-ink">Explore the complete township <span aria-hidden="true">↗</span></a></div>
              </div>
            </Reveal>
            <Reveal delay={0.07}>
              <div className="mt-6 rounded-[22px] border border-ink/12 p-6 sm:p-8">
                <h3 className="font-display text-[30px] leading-tight">The details, to keep.</h3>
                <p className="mt-3 max-w-[45ch] text-[13px] leading-[1.8] text-ink/70">Print the master plan or take a copy of the full plot schedule for a closer look.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/brochure" target="_blank" rel="noreferrer" className="button-primary"><FileText size={15} aria-hidden="true" />Printable plan</a>
                  <button type="button" onClick={downloadCsv} className="button-secondary"><Download size={15} aria-hidden="true" />Plot schedule</button>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:pl-4">
            <Reveal delay={0.08}>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-7 border-b border-ink/15 pb-8">
                {[
                  { label: 'Original site', value: MASTER_PLAN_STATS.siteAreaAcres.toFixed(2), unit: 'acres' },
                  { label: 'Central park', value: MASTER_PLAN_STATS.parkAreaSqm.toLocaleString('en-IN'), unit: 'sq m' },
                  { label: 'Plot size bands', value: String(MASTER_PLAN_STATS.sizeBands.length).padStart(2, '0'), unit: 'profiles' },
                  { label: 'Open space', value: String(MASTER_PLAN_STATS.openSpacePercent), unit: '%' },
                ].map((stat) => <div key={stat.label}><dt className="eyebrow text-ink/70">{stat.label}</dt><dd className="numeric mt-3 font-display text-[38px] leading-none tracking-[-0.05em]">{stat.value}<span className="ml-1.5 font-sans text-[11px] tracking-normal text-ink/70">{stat.unit}</span></dd></div>)}
              </dl>
            </Reveal>
            {INFRASTRUCTURE.filter((_, index) => index !== 3).map((item, index) => (
              <Reveal key={item.title} delay={0.04 * index}>
                <article className="border-b border-ink/15 py-6"><div className="flex items-baseline gap-4"><span className="numeric text-[10px] text-bronze">{String(index + 1).padStart(2, '0')}</span><h3 className="font-display text-[25px] leading-tight">{item.title}</h3></div><p className="mt-3 pl-8 text-[12px] leading-[1.85] text-ink/70">{item.body}</p></article>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <div className="mt-12 overflow-x-auto rounded-[20px] border border-ink/15">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">Original residential plot size profiles</caption>
              <thead><tr className="bg-bone-deep/70">{['Size profile', 'Area', 'Character', 'Parcels'].map((label) => <th key={label} scope="col" className="px-6 py-5 text-[10px] font-medium tracking-[0.12em] text-ink/70 uppercase last:text-right">{label}</th>)}</tr></thead>
              <tbody>{MASTER_PLAN_STATS.sizeBands.map((band) => <tr key={band.label} className="border-t border-ink/10"><td className="px-6 py-5 font-display text-[21px]">{band.label}</td><td className="numeric px-6 py-5 text-[13px]">{band.areaSqft.toLocaleString('en-IN')} sq ft</td><td className="px-6 py-5 text-[12px] text-ink/70">{band.note}</td><td className="numeric px-6 py-5 text-right text-[13px]">{band.count}</td></tr>)}</tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
