import type { TimeOfDay } from '../types';

export interface LightingPreset {
  sunDirection: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  skyColor: string;
  groundColor: string;
  hemiIntensity: number;
  turbidity: number;
  rayleigh: number;
  exposure: number;
}

export const LIGHTING: Record<TimeOfDay, LightingPreset> = {
  day: {
    sunDirection: [-0.48, 0.72, 0.45],
    sunColor: '#fff8ef',
    sunIntensity: 2.8,
    skyColor: '#b7d5f2',
    groundColor: '#82926d',
    hemiIntensity: 0.8,
    turbidity: 1.8,
    rayleigh: 1,
    exposure: 0.94,
  },
  golden: {
    sunDirection: [-0.68, 0.38, 0.5],
    sunColor: '#ffddb3',
    sunIntensity: 2.8,
    skyColor: '#b7cfe7',
    groundColor: '#86805c',
    hemiIntensity: 0.65,
    turbidity: 2.2,
    rayleigh: 1.2,
    exposure: 0.94,
  },
  dusk: {
    sunDirection: [-0.62, 0.08, -0.52],
    sunColor: '#ff8f52',
    sunIntensity: 0.9,
    skyColor: '#849cc4',
    groundColor: '#556354',
    hemiIntensity: 0.65,
    turbidity: 2.8,
    rayleigh: 1.8,
    exposure: 1.08,
  },
};
