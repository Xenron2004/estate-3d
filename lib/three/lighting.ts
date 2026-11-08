import type { TimeOfDay } from '../types';

export interface LightingPreset {
  sunDirection: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  skyColor: string;
  groundColor: string;
  hemiIntensity: number;
  fog: string;
  fogNear: number;
  fogFar: number;
  turbidity: number;
  rayleigh: number;
  exposure: number;
}

export const LIGHTING: Record<TimeOfDay, LightingPreset> = {
  day: {
    sunDirection: [0.42, 0.74, 0.52],
    sunColor: '#fff3dc',
    sunIntensity: 2.6,
    skyColor: '#bcd4f4',
    groundColor: '#8c8265',
    hemiIntensity: 0.85,
    fog: '#c9d7dc',
    fogNear: 340,
    fogFar: 2000,
    turbidity: 5,
    rayleigh: 1.1,
    exposure: 1.02,
  },
  golden: {
    sunDirection: [-0.8, 0.22, -0.42],
    sunColor: '#ffb066',
    sunIntensity: 2.7,
    skyColor: '#f0d3b2',
    groundColor: '#6d5b42',
    hemiIntensity: 0.7,
    fog: '#e3c7a3',
    fogNear: 260,
    fogFar: 1700,
    turbidity: 8,
    rayleigh: 2.6,
    exposure: 1.06,
  },
  dusk: {
    sunDirection: [-0.62, 0.08, -0.52],
    sunColor: '#ff8f52',
    sunIntensity: 1.15,
    skyColor: '#6d7ba0',
    groundColor: '#3c3b3c',
    hemiIntensity: 0.62,
    fog: '#5e6884',
    fogNear: 150,
    fogFar: 1250,
    turbidity: 10,
    rayleigh: 3.2,
    exposure: 1.12,
  },
};
