import type { Plot } from './types';

/** Home / aerial framing of the whole township. */
export const CAMERA_PRESETS = {
  home: {
    position: [235, 205, 390] as [number, number, number],
    target: [0, 4, 140] as [number, number, number],
  },
  plan: {
    position: [0, 430, 144] as [number, number, number],
    target: [0, 0, 143] as [number, number, number],
  },
  introHero: {
    position: [176, 152, -46] as [number, number, number],
    target: [0, 0, 58] as [number, number, number],
  },
  introExplorer: {
    position: [260, 245, 430] as [number, number, number],
    target: [0, 4, 140] as [number, number, number],
  },
  entrance: {
    position: [26, 17, 46] as [number, number, number],
    target: [0, 2, 12] as [number, number, number],
  },
  apartments: {
    position: [165, 112, 370] as [number, number, number],
    target: [0, 15, 238] as [number, number, number],
  },
};

export const TOWNSHIP_VIEW_BOUNDS = { minX: -116, maxX: 116, minY: 0, maxY: 43, minZ: 6, maxZ: 281 };
export const APARTMENTS_VIEW_BOUNDS = { minX: -104, maxX: 104, minY: 0, maxY: 43, minZ: 194, maxZ: 281 };

/** Preserve the view angle while fitting every corner on narrow and wide screens. */
export function fitCameraPosition(
  position: [number, number, number],
  target: [number, number, number],
  bounds: typeof TOWNSHIP_VIEW_BOUNDS,
  aspect: number,
  fov = 42,
): [number, number, number] {
  const offset = position.map((value, axis) => value - target[axis]);
  const distance = Math.hypot(...offset);
  const n = offset.map((value) => value / distance);
  const horizontal = Math.hypot(n[0], n[2]);
  const right = horizontal > 0.00001 ? [n[2] / horizontal, 0, -n[0] / horizontal] : [1, 0, 0];
  const up = [n[1] * right[2], n[2] * right[0] - n[0] * right[2], -n[1] * right[0]];
  const verticalTan = Math.tan(fov * Math.PI / 360) * 0.9;
  const horizontalTan = verticalTan * Math.max(0.4, aspect);
  let fittedDistance = distance;
  for (const x of [bounds.minX, bounds.maxX]) {
    for (const y of [bounds.minY, bounds.maxY]) {
      for (const z of [bounds.minZ, bounds.maxZ]) {
        const relative = [x - target[0], y - target[1], z - target[2]];
        const dot = (vector: number[]) => relative.reduce((sum, value, axis) => sum + value * vector[axis], 0);
        fittedDistance = Math.max(fittedDistance, dot(n) + Math.max(Math.abs(dot(right)) / horizontalTan, Math.abs(dot(up)) / verticalTan));
      }
    }
  }
  return [target[0] + n[0] * fittedDistance, target[1] + n[1] * fittedDistance, target[2] + n[2] * fittedDistance];
}

const FACING_VECTORS: Record<string, [number, number]> = {
  north: [0, -1],
  south: [0, 1],
  east: [1, 0],
  west: [-1, 0],
};

/** Camera framing used when a parcel is focused. */
export function plotCamera(plot: Plot): {
  position: [number, number, number];
  target: [number, number, number];
} {
  const dir = FACING_VECTORS[plot.facing] ?? [0, 1];
  return {
    position: [plot.x + dir[0] * 36, 29, plot.z + dir[1] * 36],
    target: [plot.x, 1.5, plot.z],
  };
}
