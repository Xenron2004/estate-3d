'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import Instances, { type InstanceDef } from './Instances';
import { ROADS } from '@/lib/data/township';

function segments(start: number, end: number, gaps: [number, number][]): [number, number][] {
  const sorted = [...gaps].sort((a, b) => a[0] - b[0]);
  const result: [number, number][] = [];
  let cursor = start;
  for (const [gapStart, gapEnd] of sorted) {
    if (gapStart > cursor) result.push([cursor, Math.min(gapStart, end)]);
    cursor = Math.max(cursor, gapEnd);
  }
  if (cursor < end) result.push([cursor, end]);
  return result.filter(([a, b]) => b - a > 0.5);
}

export default function Roads3D({ quality }: { quality: 'high' | 'low' }) {
  const kerbs = useMemo<InstanceDef[]>(() => {
    const items: InstanceDef[] = [];
    const kerbHeight = 0.17;
    const kerbWidth = 0.42;

    const spineGaps: [number, number][] = [
      [ROADS.streetOne.center - 5, ROADS.streetOne.center + 5],
      [ROADS.streetTwo.center - 5, ROADS.streetTwo.center + 5],
      [175, 184],
    ];
    const avenueGaps: [number, number][] = [[-5, 5]];
    const linkGaps: [number, number][] = [
      [ROADS.avenue.center - 5, ROADS.avenue.center + 5],
      [ROADS.streetOne.center - 5, ROADS.streetOne.center + 5],
      [ROADS.streetTwo.center - 5, ROADS.streetTwo.center + 5],
    ];

    const addEdge = (
      axis: 'x' | 'z',
      road: { center: number; from: number; to: number; width: number },
      side: 1 | -1,
      gaps: [number, number][],
    ) => {
      const edge = road.center + (side * road.width) / 2;
      for (const [a, b] of segments(road.from, road.to, gaps)) {
        const length = b - a;
        const mid = (a + b) / 2;
        if (axis === 'x') {
          items.push({
            position: [mid, kerbHeight / 2, edge],
            scale: [length, kerbHeight, kerbWidth],
            color: '#c3bba9',
          });
        } else {
          items.push({
            position: [edge, kerbHeight / 2, mid],
            scale: [kerbWidth, kerbHeight, length],
            color: '#c3bba9',
          });
        }
      }
    };

    addEdge('x', ROADS.avenue, 1, avenueGaps);
    addEdge('x', ROADS.avenue, -1, avenueGaps);
    addEdge('x', ROADS.streetOne, 1, avenueGaps);
    addEdge('x', ROADS.streetOne, -1, avenueGaps);
    addEdge('x', ROADS.streetTwo, 1, avenueGaps);
    addEdge('x', ROADS.streetTwo, -1, avenueGaps);
    addEdge('z', ROADS.spine, 1, spineGaps);
    addEdge('z', ROADS.spine, -1, spineGaps);
    addEdge('z', ROADS.linkWest, 1, linkGaps);
    addEdge('z', ROADS.linkWest, -1, linkGaps);
    addEdge('z', ROADS.linkEast, 1, linkGaps);
    addEdge('z', ROADS.linkEast, -1, linkGaps);

    return items;
  }, []);

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c3bba9', roughness: 0.85, metalness: 0 }),
    [],
  );

  const markings = useMemo<InstanceDef[]>(() => {
    const items: InstanceDef[] = [];
    // traffic islands along the arterial
    for (let x = -300; x < 300; x += 60) {
      items.push({
        position: [x, 0.08, ROADS.arterial.center],
        scale: [22, 0.16, 0.7],
        color: '#ded7c6',
      });
    }
    return items;
  }, []);

  return (
    <group>
      <Instances geometry={geometry} material={material} items={kerbs} receiveShadow castShadow={quality === 'high'} />
      <Instances
        geometry={geometry}
        material={material}
        items={markings}
        receiveShadow
      />
    </group>
  );
}
