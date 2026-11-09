import { GREEN, PLOTS, ROADS, SITE } from '../data/township';
import { mulberry32 } from './assets';
import { createParkTrail } from './park-trail';

/** World rectangle covered by the painted master-plan texture. */
export const PLAN = { minX: -125, maxX: 125, minZ: -4, maxZ: 198 };

const EARTH = '#c3b69a';
const EARTH_DARK = '#ab9e83';
const SCRUB = '#8d9867';
const LAWN = '#789850';
const LAWN_LIGHT = '#91aa65';
const LAWN_DARK = '#648546';
const ASPHALT = '#3c3c39';
const ASPHALT_WORN = '#474742';
const KERB = '#b3ac9c';
const WALK = '#c6bfad';
const DRAIN = '#57544d';
const SAND = '#d6c49b';
const RUBBER = '#7d8f92';
const WHITE = '#e6e1d2';
const YELLOW = '#cfab55';
const PAVING = '#bdb6a5';

function segments(start: number, end: number, gaps: [number, number][]): [number, number][] {
  const sorted = [...gaps].sort((a, b) => a[0] - b[0]);
  const result: [number, number][] = [];
  let cursor = start;
  for (const [gapStart, gapEnd] of sorted) {
    if (gapStart > cursor) result.push([cursor, Math.min(gapStart, end)]);
    cursor = Math.max(cursor, gapEnd);
  }
  if (cursor < end) result.push([cursor, end]);
  return result.filter(([a, b]) => b - a > 0.4);
}

export function paintSitePlan(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const random = mulberry32(20241118);
  const s = W / (PLAN.maxX - PLAN.minX);
  const X = (x: number) => (x - PLAN.minX) * s;
  const Z = (z: number) => (z - PLAN.minZ) * s;
  const R = (m: number) => m * s;

  const rect = (x0: number, z0: number, x1: number, z1: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(X(x0), Z(z0), R(x1 - x0), R(z1 - z0));
  };

  const speckle = (
    x0: number,
    z0: number,
    x1: number,
    z1: number,
    count: number,
    color: string,
    min = 0.6,
    max = 2.4,
  ) => {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i += 1) {
      const px = X(x0) + random() * R(x1 - x0);
      const py = Z(z0) + random() * R(z1 - z0);
      const r = min + random() * (max - min);
      ctx.globalAlpha = 0.25 + random() * 0.45;
      ctx.fillRect(px, py, r, r);
    }
    ctx.globalAlpha = 1;
  };

  // ---------------------------------------------------------------- ground
  rect(PLAN.minX, PLAN.minZ, PLAN.maxX, PLAN.maxZ, EARTH);
  for (let i = 0; i < 26; i += 1) {
    const px = X(PLAN.minX) + random() * W;
    const py = Z(PLAN.minZ) + random() * H;
    const radius = R(14 + random() * 26);
    const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius);
    gradient.addColorStop(0, random() > 0.5 ? 'rgba(150,138,110,0.45)' : 'rgba(206,195,170,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
  }
  speckle(PLAN.minX, PLAN.minZ, PLAN.maxX, PLAN.maxZ, 9000, '#8d8168', 0.5, 1.8);

  // scrub belt outside the compound
  rect(PLAN.minX, PLAN.minZ, SITE.minX, SITE.maxZ, SCRUB);
  rect(SITE.maxX, PLAN.minZ, PLAN.maxX, SITE.maxZ, SCRUB);
  rect(PLAN.minX, PLAN.minZ, PLAN.maxX, SITE.minZ, SCRUB);
  rect(PLAN.minX, SITE.maxZ, PLAN.maxX, PLAN.maxZ, SCRUB);
  speckle(PLAN.minX, PLAN.minZ, SITE.minX, SITE.maxZ, 1200, '#6f7148', 0.6, 2.2);
  speckle(PLAN.minX, PLAN.minZ, PLAN.maxX, SITE.minZ, 900, '#6f7148', 0.6, 2.2);

  // ---------------------------------------------------------------- lawns
  const lawnAreas: [number, number, number, number][] = [
    [GREEN.parkMinX, GREEN.parkMinZ, GREEN.parkMaxX, GREEN.parkMaxZ],
    [GREEN.beltMinX, GREEN.beltMinZ, -4.57, GREEN.beltMaxZ],
    [4.57, GREEN.beltMinZ, GREEN.beltMaxX, GREEN.beltMaxZ],
    [-26, GREEN.playMinZ, 26, GREEN.playMaxZ],
    [SITE.minX + 2, SITE.minZ + 2, SITE.minX + 12, SITE.maxZ - 2],
    [SITE.maxX - 12, SITE.minZ + 2, SITE.maxX - 2, SITE.maxZ - 2],
    [SITE.minX + 2, SITE.maxZ - 12, SITE.maxX - 2, SITE.maxZ - 2],
  ];
  for (const [x0, z0, x1, z1] of lawnAreas) {
    rect(x0, z0, x1, z1, LAWN);
    // mown bands
    ctx.save();
    ctx.globalAlpha = 0.16;
    for (let z = z0; z < z1; z += 6) {
      rect(x0, z, x1, z + 3, LAWN_LIGHT);
    }
    ctx.restore();
    speckle(x0, z0, x1, z1, Math.round((x1 - x0) * (z1 - z0) * 0.06), LAWN_DARK, 0.5, 2);
  }

  // ---------------------------------------------------------------- roads
  const arterial = ROADS.arterial;
  const avenue = ROADS.avenue;
  const spine = ROADS.spine;
  const streetOne = ROADS.streetOne;
  const streetTwo = ROADS.streetTwo;
  const linkWest = ROADS.linkWest;
  const linkEast = ROADS.linkEast;

  const paintAsphalt = (
    axis: 'x' | 'z',
    center: number,
    from: number,
    to: number,
    width: number,
  ) => {
    if (axis === 'x') rect(from, center - width / 2, to, center + width / 2, ASPHALT);
    else rect(center - width / 2, from, center + width / 2, to, ASPHALT);
  };

  paintAsphalt('x', arterial.center, PLAN.minX, PLAN.maxX, arterial.width);
  paintAsphalt('x', avenue.center, avenue.from, avenue.to, avenue.width);
  paintAsphalt('x', streetOne.center, streetOne.from, streetOne.to, streetOne.width);
  paintAsphalt('x', streetTwo.center, streetTwo.from, streetTwo.to, streetTwo.width);
  paintAsphalt('z', spine.center, spine.from, spine.to, spine.width);
  paintAsphalt('z', linkWest.center, linkWest.from, linkWest.to, linkWest.width);
  paintAsphalt('z', linkEast.center, linkEast.from, linkEast.to, linkEast.width);

  // worn wheel tracks
  ctx.save();
  ctx.globalAlpha = 0.35;
  for (const road of [avenue, streetOne, streetTwo]) {
    rect(road.from, road.center - road.width * 0.34, road.to, road.center - road.width * 0.2, ASPHALT_WORN);
    rect(road.from, road.center + road.width * 0.2, road.to, road.center + road.width * 0.34, ASPHALT_WORN);
  }
  rect(PLAN.minX, arterial.center - arterial.width * 0.34, PLAN.maxX, arterial.center - arterial.width * 0.2, ASPHALT_WORN);
  rect(PLAN.minX, arterial.center + arterial.width * 0.2, PLAN.maxX, arterial.center + arterial.width * 0.34, ASPHALT_WORN);
  ctx.restore();

  speckle(PLAN.minX, arterial.center - 10, PLAN.maxX, arterial.center + 10, 2600, '#6d6c66', 0.5, 1.7);

  // kerb + drainage + footpath bands along every internal road
  const band = (
    axis: 'x' | 'z',
    road: { center: number; from: number; to: number; width: number },
    side: 1 | -1,
    gaps: [number, number][],
  ) => {
    const edge = road.center + (side * road.width) / 2;
    const kerbOuter = edge + side * 0.42;
    const drainOuter = kerbOuter + side * 0.32;
    const walkOuter = drainOuter + side * 1.55;

    for (const [a, b] of segments(road.from, road.to, gaps)) {
      if (axis === 'x') {
        rect(a, Math.min(edge, kerbOuter), b, Math.max(edge, kerbOuter), KERB);
        rect(a, Math.min(kerbOuter, drainOuter), b, Math.max(kerbOuter, drainOuter), DRAIN);
        rect(a, Math.min(drainOuter, walkOuter), b, Math.max(drainOuter, walkOuter), WALK);
      } else {
        rect(Math.min(edge, kerbOuter), a, Math.max(edge, kerbOuter), b, KERB);
        rect(Math.min(kerbOuter, drainOuter), a, Math.max(kerbOuter, drainOuter), b, DRAIN);
        rect(Math.min(drainOuter, walkOuter), a, Math.max(drainOuter, walkOuter), b, WALK);
      }
    }
  };

  const spineGaps: [number, number][] = [
    [streetOne.center - streetOne.width / 2, streetOne.center + streetOne.width / 2],
    [streetTwo.center - streetTwo.width / 2, streetTwo.center + streetTwo.width / 2],
    [176, 184],
  ];
  const avenueGaps: [number, number][] = [
    [spine.center - spine.width / 2, spine.center + spine.width / 2],
  ];
  const linkGaps: [number, number][] = [
    [avenue.center - avenue.width / 2, avenue.center + avenue.width / 2],
    [streetOne.center - streetOne.width / 2, streetOne.center + streetOne.width / 2],
    [streetTwo.center - streetTwo.width / 2, streetTwo.center + streetTwo.width / 2],
  ];
  const streetGaps: [number, number][] = [
    [spine.center - spine.width / 2, spine.center + spine.width / 2],
  ];

  band('x', avenue, 1, avenueGaps);
  band('x', avenue, -1, avenueGaps);
  band('x', streetOne, 1, streetGaps);
  band('x', streetOne, -1, streetGaps);
  band('x', streetTwo, 1, streetGaps);
  band('x', streetTwo, -1, streetGaps);
  band('z', spine, 1, spineGaps);
  band('z', spine, -1, spineGaps);
  band('z', linkWest, 1, linkGaps);
  band('z', linkWest, -1, linkGaps);
  band('z', linkEast, 1, linkGaps);
  band('z', linkEast, -1, linkGaps);

  // footpath joint lines
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = '#9d957f';
  ctx.lineWidth = Math.max(1, R(0.08));
  for (const road of [avenue, streetOne, streetTwo]) {
    for (const side of [1, -1]) {
      const walkCentre = road.center + side * (road.width / 2 + 1.1);
      for (let x = road.from; x < road.to; x += 4) {
        ctx.beginPath();
        ctx.moveTo(X(x), Z(walkCentre - 0.75));
        ctx.lineTo(X(x), Z(walkCentre + 0.75));
        ctx.stroke();
      }
    }
  }
  ctx.restore();

  // road markings
  ctx.save();
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = Math.max(1, R(0.16));
  ctx.setLineDash([R(3), R(4)]);
  for (const road of [avenue, streetOne, streetTwo]) {
    ctx.beginPath();
    ctx.moveTo(X(road.from), Z(road.center));
    ctx.lineTo(X(road.to), Z(road.center));
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = Math.max(1, R(0.18));
  for (const side of [1, -1]) {
    ctx.beginPath();
    ctx.moveTo(X(PLAN.minX), Z(arterial.center + side * (arterial.width / 2 - 0.7)));
    ctx.lineTo(X(PLAN.maxX), Z(arterial.center + side * (arterial.width / 2 - 0.7)));
    ctx.stroke();
  }
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = Math.max(1, R(0.18));
  ctx.setLineDash([R(5), R(5)]);
  ctx.beginPath();
  ctx.moveTo(X(PLAN.minX), Z(arterial.center));
  ctx.lineTo(X(PLAN.maxX), Z(arterial.center));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // ---------------------------------------------------------------- parcels
  for (const plot of PLOTS) {
    rect(plot.minX, plot.minZ, plot.maxX, plot.maxZ, SAND);
    speckle(plot.minX, plot.minZ, plot.maxX, plot.maxZ, 90, '#a89268', 0.5, 1.6);
  }
  ctx.save();
  ctx.strokeStyle = 'rgba(250,248,240,0.85)';
  ctx.lineWidth = Math.max(1, R(0.22));
  ctx.setLineDash([R(1.6), R(1.2)]);
  for (const plot of PLOTS) {
    ctx.strokeRect(X(plot.minX), Z(plot.minZ), R(plot.width), R(plot.depth));
  }
  ctx.setLineDash([]);
  // survey corner markers
  ctx.fillStyle = 'rgba(40,46,42,0.75)';
  for (const plot of PLOTS) {
    for (const [cx, cz] of [
      [plot.minX, plot.minZ],
      [plot.maxX, plot.minZ],
      [plot.maxX, plot.maxZ],
      [plot.minX, plot.maxZ],
    ]) {
      ctx.fillRect(X(cx) - R(0.3), Z(cz) - R(0.3), R(0.6), R(0.6));
    }
  }
  ctx.restore();

  // ---------------------------------------------------------------- park
  ctx.save();
  ctx.strokeStyle = PAVING;
  ctx.lineWidth = R(2.2);
  ctx.lineCap = 'round';
  ctx.beginPath();
  createParkTrail(0).getPoints(160).forEach((point, index) => {
    if (index === 0) ctx.moveTo(X(point.x), Z(point.z));
    else ctx.lineTo(X(point.x), Z(point.z));
  });
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // gazebo plaza
  ctx.fillStyle = PAVING;
  ctx.beginPath();
  ctx.arc(X(0), Z(150), R(7), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,112,96,0.5)';
  ctx.lineWidth = Math.max(1, R(0.15));
  ctx.stroke();

  // play court
  ctx.save();
  ctx.fillStyle = SAND;
  ctx.beginPath();
  ctx.roundRect(X(-24), Z(78), R(48), R(32), R(6));
  ctx.fill();
  ctx.fillStyle = RUBBER;
  ctx.beginPath();
  ctx.roundRect(X(-16), Z(84), R(32), R(20), R(5));
  ctx.fill();
  ctx.restore();

  // clubhouse terrace + parking
  rect(GREEN.clubhouseTerrace.minX, GREEN.clubhouseTerrace.minZ, GREEN.clubhouseTerrace.maxX, GREEN.clubhouseTerrace.maxZ, PAVING);
  rect(GREEN.parking.minX, GREEN.parking.minZ, GREEN.parking.maxX, GREEN.parking.maxZ, ASPHALT);
  ctx.save();
  ctx.strokeStyle = 'rgba(240,236,224,0.75)';
  ctx.lineWidth = Math.max(1, R(0.16));
  for (let x = GREEN.parking.minX + 2.6; x < GREEN.parking.maxX - 2; x += 2.6) {
    ctx.beginPath();
    ctx.moveTo(X(x), Z(GREEN.parking.minZ + 1));
    ctx.lineTo(X(x), Z(GREEN.parking.minZ + 5.2));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(x), Z(GREEN.parking.maxZ - 5.2));
    ctx.lineTo(X(x), Z(GREEN.parking.maxZ - 1));
    ctx.stroke();
  }
  ctx.restore();
  speckle(GREEN.parking.minX, GREEN.parking.minZ, GREEN.parking.maxX, GREEN.parking.maxZ, 500, '#6c6b64', 0.4, 1.4);

  // entrance plaza
  rect(-9, SITE.minZ + 0.5, 9, SITE.minZ + 9, PAVING);
  ctx.save();
  ctx.strokeStyle = 'rgba(120,112,96,0.45)';
  ctx.lineWidth = Math.max(1, R(0.12));
  for (let x = -9; x <= 9; x += 3) {
    ctx.beginPath();
    ctx.moveTo(X(x), Z(SITE.minZ + 0.5));
    ctx.lineTo(X(x), Z(SITE.minZ + 9));
    ctx.stroke();
  }
  ctx.restore();

  // low planting inside the boundary verge
  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 900; i += 1) {
    const px = X(SITE.minX + 2) + random() * R(SITE.maxX - SITE.minX - 4);
    const py = Z(SITE.minZ + 2) + random() * R(SITE.maxZ - SITE.minZ - 4);
    ctx.fillStyle = random() > 0.5 ? '#5f6f3f' : '#7c8a55';
    ctx.fillRect(px, py, R(0.5), R(0.5));
  }
  ctx.restore();
}

/** Tileable field/dirt texture used for the terrain beyond the site. */
export function paintTerrain(ctx: CanvasRenderingContext2D, size: number) {
  const random = mulberry32(7788);
  ctx.fillStyle = '#929a70';
  ctx.fillRect(0, 0, size, size);

  const fields = 16;
  for (let i = 0; i < fields; i += 1) {
    const w = size * (0.12 + random() * 0.26);
    const h = size * (0.12 + random() * 0.26);
    const x = random() * size;
    const y = random() * size;
    const tones = ['#879b69', '#a8a47c', '#768957', '#b6ad87', '#81945f', '#98a373'];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((random() - 0.5) * 0.3);
    ctx.fillStyle = tones[Math.floor(random() * tones.length)];
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = 'rgba(120,112,84,0.55)';
    ctx.lineWidth = 2;
    for (let k = -h / 2; k < h / 2; k += 7) {
      ctx.beginPath();
      ctx.moveTo(-w / 2, k);
      ctx.lineTo(w / 2, k);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.globalAlpha = 1;
  for (let i = 0; i < 24000; i += 1) {
    const px = random() * size;
    const py = random() * size;
    ctx.fillStyle = random() > 0.5 ? 'rgba(120,110,84,0.35)' : 'rgba(196,184,152,0.3)';
    ctx.fillRect(px, py, 1 + random() * 2, 1 + random() * 2);
  }
}
