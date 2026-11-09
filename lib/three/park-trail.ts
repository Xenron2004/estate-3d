import * as THREE from 'three';

/** One route for the raised paving, walkers and planting clearances. */
export const PARK_TRAIL_POINTS: [number, number][] = [
  [-26, 126], [-29, 143], [-11, 151], [-8, 166], [-4, 176],
  [16, 174], [29, 160], [28, 146], [19, 132], [-4, 123],
];

export function createParkTrail(height: number) {
  return new THREE.CatmullRomCurve3(
    PARK_TRAIL_POINTS.map(([x, z]) => new THREE.Vector3(x, height, z)),
    true,
    'catmullrom',
    0.35,
  );
}
