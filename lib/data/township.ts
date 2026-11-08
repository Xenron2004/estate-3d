import type { Facing, Plot, PlotStatus, RoadSpec } from '../types';
import { M_TO_FT, SQFT_PER_SQM } from '../format';

/**
 * AURELIA ESTATES — canonical township configuration.
 *
 * Everything downstream (3D scene, inventory, filters, brochure, database seed)
 * is derived from this single source of truth, so areas, prices, facings and
 * geometry can never drift apart. Replace the numbers here to re-brand or
 * re-plan the development without touching component code.
 *
 * Coordinate system: metres, x = east, z = north, y = up (render space).
 */

export const BRAND = {
  name: 'Aurelia Estates',
  tagline: 'Your Land. Your Legacy.',
  subline: 'A 50-plot planned residential township on the 60 ft connect.',
  location: 'Demo location — Aurelia belt, illustrative geography',
  phone: '+91 90000 00000',
  email: 'enquiries@aureliaestates.demo',
  whatsapp: '919000000000',
};

export const SITE = {
  minX: -115,
  maxX: 115,
  minZ: 6,
  maxZ: 188,
  wallInset: 2,
  planPadding: 10,
};

export const ROADS: Record<string, RoadSpec> = {
  arterial: {
    id: 'arterial',
    label: '60 ft Connective Road',
    shortLabel: '60 ft connect',
    width: 18.29,
    axis: 'x',
    center: -4,
    from: -420,
    to: 420,
    grade: 'arterial',
  },
  avenue: {
    id: 'avenue',
    label: 'Avenue · 30 ft',
    shortLabel: 'Avenue',
    width: 9.14,
    axis: 'x',
    center: 30,
    from: -101.43,
    to: 101.43,
    grade: 'internal',
  },
  spine: {
    id: 'spine',
    label: 'Spine Road · 30 ft',
    shortLabel: 'Spine',
    width: 9.14,
    axis: 'z',
    center: 0,
    from: 5.15,
    to: 182,
    grade: 'internal',
  },
  streetOne: {
    id: 'streetOne',
    label: 'Row Street One · 30 ft',
    shortLabel: 'Row Street One',
    width: 9.14,
    axis: 'x',
    center: 92.14,
    from: -101.43,
    to: 101.43,
    grade: 'internal',
  },
  streetTwo: {
    id: 'streetTwo',
    label: 'Row Street Two · 30 ft',
    shortLabel: 'Row Street Two',
    width: 9.14,
    axis: 'x',
    center: 148.28,
    from: -101.43,
    to: 101.43,
    grade: 'internal',
  },
  linkWest: {
    id: 'linkWest',
    label: 'West Link Road · 30 ft',
    shortLabel: 'West Link',
    width: 9.14,
    axis: 'z',
    center: -106,
    from: 25.43,
    to: 152.85,
    grade: 'internal',
  },
  linkEast: {
    id: 'linkEast',
    label: 'East Link Road · 30 ft',
    shortLabel: 'East Link',
    width: 9.14,
    axis: 'z',
    center: 106,
    from: 25.43,
    to: 152.85,
    grade: 'internal',
  },
};

export const GREEN = {
  /** central landscaped spine: two green belts + the park in the north */
  beltMinX: -36.43,
  beltMaxX: 36.43,
  beltMinZ: 34.57,
  beltMaxZ: 118,
  parkMinX: -36.43,
  parkMaxX: 36.43,
  parkMinZ: 118,
  parkMaxZ: 182,
  playMinX: -26,
  playMaxX: 26,
  playMinZ: 76,
  playMaxZ: 112,
  clubhouse: { minX: -16, maxX: 16, minZ: 42, maxZ: 62 },
  clubhouseTerrace: { minX: -24, maxX: 24, minZ: 26, maxZ: 42 },
  parking: { minX: -30, maxX: 30, minZ: 10, maxZ: 24 },
  gateZ: 8,
};

const BLOCKS = [
  { id: 'A' as const, originX: -101.43, cols: 5, colWidth: 13, linkSide: 'west' as const },
  { id: 'B' as const, originX: 36.43, cols: 5, colWidth: 13, linkSide: 'east' as const },
];

interface RowSpec {
  depth: number;
  facing: Facing;
  rate: number;
  road: keyof typeof ROADS;
}

/** north → south sequence of the block: rows separated by two link streets */
const LAYOUT: ({ kind: 'row'; spec: RowSpec } | { kind: 'road'; id: keyof typeof ROADS })[] = [
  { kind: 'row', spec: { depth: 28, facing: 'south', rate: 4150, road: 'avenue' } },
  { kind: 'row', spec: { depth: 25, facing: 'north', rate: 3850, road: 'streetOne' } },
  { kind: 'road', id: 'streetOne' },
  { kind: 'row', spec: { depth: 22, facing: 'south', rate: 3600, road: 'streetOne' } },
  { kind: 'row', spec: { depth: 25, facing: 'north', rate: 3500, road: 'streetTwo' } },
  { kind: 'road', id: 'streetTwo' },
  { kind: 'row', spec: { depth: 22, facing: 'south', rate: 3350, road: 'streetTwo' } },
];

const STATUS_MAP: Record<string, PlotStatus> = {
  'A-06': 'sold',
  'A-13': 'sold',
  'A-22': 'sold',
  'B-03': 'sold',
  'B-14': 'sold',
  'B-25': 'sold',
  'A-01': 'booked',
  'A-07': 'booked',
  'A-11': 'booked',
  'A-18': 'booked',
  'A-24': 'booked',
  'B-01': 'booked',
  'B-08': 'booked',
  'B-12': 'booked',
  'B-20': 'booked',
  'B-23': 'booked',
};

const AMENITY_ANCHORS = {
  park: { x: 0, z: 150 },
  play: { x: 0, z: 94 },
  club: { x: 0, z: 52 },
  entrance: { x: 0, z: GREEN.gateZ },
};

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function describePlot(plot: Plot): string {
  const width = Math.round(plot.width * M_TO_FT);
  const depth = Math.round(plot.depth * M_TO_FT);
  const opening =
    plot.facing === 'north'
      ? `${width} ft × ${depth} ft parcel opening north onto ${plot.roadName}`
      : `${width} ft × ${depth} ft parcel opening south onto ${plot.roadName}`;

  const extras: string[] = [];
  if (plot.premium === 'Green belt frontage') {
    extras.push('one long edge left open to the landscaped central green');
  }
  if (plot.secondaryFrontage) {
    extras.push(`a second ${plot.secondaryFrontage}-side frontage onto the link road`);
  }
  extras.push('kerbed 30 ft carriageway with footpath and covered drainage at the boundary');
  if (plot.rowIndex === 1) {
    extras.push('the deepest profile in its row, held back for a porch and front garden');
  }
  if (plot.rowIndex === 5) {
    extras.push('a quiet rear-of-block position with no through traffic');
  }
  if (plot.status === 'booked') {
    extras.push('currently reserved — join the waiting list');
  }
  if (plot.status === 'sold') {
    extras.push('already transferred — comparable plots remain open');
  }

  return `${opening}. ${extras.join(', ')}.`;
}

function buildPlots(): Plot[] {
  const plots: Plot[] = [];
  const rowStartZ = ROADS.avenue.center + ROADS.avenue.width / 2;

  for (const block of BLOCKS) {
    let cursor = rowStartZ;
    let rowIndex = 0;

    for (const item of LAYOUT) {
      if (item.kind === 'road') {
        cursor += ROADS[item.id].width;
        continue;
      }
      rowIndex += 1;
      const spec = item.spec;
      const z0 = cursor;
      const z1 = cursor + spec.depth;
      cursor = z1;

      for (let col = 0; col < block.cols; col += 1) {
        const x0 = block.originX + col * block.colWidth;
        const x1 = x0 + block.colWidth;
        const id = `${block.id}-${String((rowIndex - 1) * block.cols + col + 1).padStart(2, '0')}`;

        const areaSqm = Math.round((x1 - x0) * (z1 - z0) * 100) / 100;
        const areaSqft = Math.round(areaSqm * SQFT_PER_SQM);

        // Distance in columns from the central green — the closest column
        // carries a premium, the furthest column is neutral.
        const stepsFromGreen = block.id === 'A' ? block.cols - 1 - col : col;
        const positionFactor = 1.06 - 0.015 * stepsFromGreen;
        const pricePerSqft = Math.round(spec.rate * positionFactor);
        const price = roundTo(areaSqft * pricePerSqft, 50000);

        const premium =
          stepsFromGreen === 0
            ? 'Green belt frontage'
            : rowIndex === 1
              ? 'Avenue frontage'
              : null;

        const secondaryFrontage: Facing | null =
          block.linkSide === 'west' && col === 0
            ? 'west'
            : block.linkSide === 'east' && col === block.cols - 1
              ? 'east'
              : null;

        const plot: Plot = {
          id,
          block: block.id,
          rowIndex,
          colIndex: col + 1,
          x: (x0 + x1) / 2,
          z: (z0 + z1) / 2,
          minX: x0,
          maxX: x1,
          minZ: z0,
          maxZ: z1,
          width: x1 - x0,
          depth: z1 - z0,
          areaSqm,
          areaSqft,
          facing: spec.facing,
          secondaryFrontage,
          roadName: ROADS[spec.road].label,
          roadWidthM: ROADS[spec.road].width,
          price,
          pricePerSqft,
          status: STATUS_MAP[id] ?? 'available',
          description: '',
          premium,
          distances: {
            park: Math.hypot((x0 + x1) / 2 - AMENITY_ANCHORS.park.x, (z0 + z1) / 2 - AMENITY_ANCHORS.park.z),
            play: Math.hypot((x0 + x1) / 2 - AMENITY_ANCHORS.play.x, (z0 + z1) / 2 - AMENITY_ANCHORS.play.z),
            club: Math.hypot((x0 + x1) / 2 - AMENITY_ANCHORS.club.x, (z0 + z1) / 2 - AMENITY_ANCHORS.club.z),
            entrance: Math.hypot(
              (x0 + x1) / 2 - AMENITY_ANCHORS.entrance.x,
              (z0 + z1) / 2 - AMENITY_ANCHORS.entrance.z,
            ),
          },
          polygon: [
            [x0, z0],
            [x1, z0],
            [x1, z1],
            [x0, z1],
          ],
        };
        plot.description = describePlot(plot);
        plots.push(plot);
      }
    }
  }

  return plots;
}

export const PLOTS: Plot[] = buildPlots();

export const PLOT_BY_ID: Record<string, Plot> = Object.fromEntries(
  PLOTS.map((plot) => [plot.id, plot]),
);

export const STATUS_COUNTS = PLOTS.reduce<Record<PlotStatus, number>>(
  (acc, plot) => {
    acc[plot.status] += 1;
    return acc;
  },
  { available: 0, booked: 0, sold: 0 },
);

export const AREA_RANGE = {
  min: Math.min(...PLOTS.map((p) => p.areaSqft)),
  max: Math.max(...PLOTS.map((p) => p.areaSqft)),
};

export const PRICE_RANGE = {
  min: Math.min(...PLOTS.map((p) => p.price)),
  max: Math.max(...PLOTS.map((p) => p.price)),
};

export const FACINGS: Facing[] = Array.from(new Set(PLOTS.map((p) => p.facing)));

const SITE_AREA = (SITE.maxX - SITE.minX) * (SITE.maxZ - SITE.minZ);
const PLOT_AREA = PLOTS.reduce((sum, p) => sum + p.areaSqm, 0);
const INTERNAL_ROAD_AREA = ['avenue', 'spine', 'streetOne', 'streetTwo', 'linkWest', 'linkEast'].reduce(
  (sum, key) => {
    const road = ROADS[key];
    const length = road.to - road.from;
    return sum + length * road.width;
  },
  0,
);
const BUILT_AREA = 640 + 26 + 220;

export const MASTER_PLAN_STATS = {
  plotCount: PLOTS.length,
  siteAreaSqm: Math.round(SITE_AREA),
  siteAreaAcres: Math.round((SITE_AREA / 4046.86) * 100) / 100,
  plotAreaSqm: Math.round(PLOT_AREA),
  roadAreaSqm: Math.round(INTERNAL_ROAD_AREA),
  openSpaceSqm: Math.round(SITE_AREA - PLOT_AREA - INTERNAL_ROAD_AREA - BUILT_AREA),
  openSpacePercent: Math.round(
    ((SITE_AREA - PLOT_AREA - INTERNAL_ROAD_AREA - BUILT_AREA) / SITE_AREA) * 100,
  ),
  internalRoadWidthM: 9.14,
  arterialWidthM: 18.29,
  parkAreaSqm: Math.round(
    (GREEN.parkMaxX - GREEN.parkMinX) * (GREEN.parkMaxZ - GREEN.parkMinZ),
  ),
  playAreaSqm: Math.round((GREEN.playMaxX - GREEN.playMinX) * (GREEN.playMaxZ - GREEN.playMinZ)),
  clubhouseAreaSqm: Math.round(
    (GREEN.clubhouse.maxX - GREEN.clubhouse.minX) * (GREEN.clubhouse.maxZ - GREEN.clubhouse.minZ),
  ),
  blocks: ['A', 'B'] as const,
  rowsPerBlock: 5,
  columnsPerBlock: 5,
  sizeBands: [
    {
      label: 'Prime avenue plots',
      areaSqft: 3918,
      note: '28 m deep × 13 m frontage',
      count: PLOTS.filter((p) => p.areaSqft === 3918).length,
    },
    {
      label: 'Inner rows',
      areaSqft: 3498,
      note: '25 m deep × 13 m frontage',
      count: PLOTS.filter((p) => p.areaSqft === 3498).length,
    },
    {
      label: 'Rear rows',
      areaSqft: 3078,
      note: '22 m deep × 13 m frontage',
      count: PLOTS.filter((p) => p.areaSqft === 3078).length,
    },
  ],
};

/** Walkthrough route — entirely on internal roads, eye height. */
export const WALKTHROUGH_POINTS: [number, number, number][] = [
  [0, 1.7, 14],
  [0, 1.7, 58],
  [0, 1.7, 92.14],
  [-45, 1.7, 92.14],
  [-106, 1.7, 92.14],
  [-106, 1.7, 58],
  [-106, 1.7, 30],
  [-62, 1.7, 30],
  [-24, 1.7, 30],
  [0, 1.7, 30],
];
