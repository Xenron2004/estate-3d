import type { Plot } from './types';

/** Home / aerial framing of the whole township. */
export const CAMERA_PRESETS = {
  home: {
    position: [96, 122, 300] as [number, number, number],
    target: [0, 0, 92] as [number, number, number],
  },
  plan: {
    position: [0, 322, 93] as [number, number, number],
    target: [0, 0, 92] as [number, number, number],
  },
  introHero: {
    position: [176, 152, -46] as [number, number, number],
    target: [0, 0, 58] as [number, number, number],
  },
  introExplorer: {
    position: [186, 216, 392] as [number, number, number],
    target: [0, 0, 92] as [number, number, number],
  },
  entrance: {
    position: [26, 17, 46] as [number, number, number],
    target: [0, 2, 12] as [number, number, number],
  },
};

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
