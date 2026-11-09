'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import Instances, { type InstanceDef } from './Instances';
import { ROADS } from '@/lib/data/township';
import { createSurfaceTexture } from '@/lib/three/surfaces';

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
  const asphalt = useMemo(() => createSurfaceTexture('asphalt'), []);
  useEffect(() => () => asphalt.dispose(), [asphalt]);
  const surface = useMemo(() => {
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    Object.values(ROADS).forEach((road) => {
      const gaps: [number, number][] = road.axis === 'z'
        ? Object.values(ROADS).filter((other) => other.axis === 'x').map((other) => [other.center - other.width / 2, other.center + other.width / 2])
        : [];
      for (const [from, to] of segments(road.from, road.to, gaps)) {
        const [x0, x1, z0, z1] = road.axis === 'x'
          ? [from, to, road.center - road.width / 2, road.center + road.width / 2]
          : [road.center - road.width / 2, road.center + road.width / 2, from, to];
        const base = vertices.length / 3;
        vertices.push(x0, 0.055, z0, x0, 0.055, z1, x1, 0.055, z0, x1, 0.055, z1);
        uvs.push(x0 / 4, z0 / 4, x0 / 4, z1 / 4, x1 / 4, z0 / 4, x1 / 4, z1 / 4);
        indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);
  useEffect(() => () => surface.dispose(), [surface]);

  const paint = useMemo<InstanceDef[]>(() => {
    const items: InstanceDef[] = [];
    Object.values(ROADS).forEach((road) => {
      for (let at = road.from + 4; at < road.to - 3; at += 7) {
        const crossing = Object.values(ROADS).some((other) => other.axis !== road.axis &&
          Math.abs(at - other.center) < other.width / 2 + 3 &&
          road.center > other.from - 2 && road.center < other.to + 2);
        if (crossing) continue;
        items.push({
          position: road.axis === 'x' ? [at, 0.064, road.center] : [road.center, 0.064, at],
          scale: road.axis === 'x' ? [2.7, 0.012, 0.13] : [0.13, 0.012, 2.7],
          color: road.grade === 'arterial' ? '#e9c675' : '#e4dfcc',
        });
      }
      if (road.grade === 'arterial') {
        for (const side of [-1, 1]) items.push({
          position: [(road.from + road.to) / 2, 0.064, road.center + side * (road.width / 2 - 0.65)],
          scale: [road.to - road.from, 0.012, 0.15], color: '#f0eada',
        });
      }
    });
    for (const z of [ROADS.avenue.center, ROADS.streetTwo.center]) {
      for (const side of [-1, 1]) {
        for (let x = -3.6; x <= 3.6; x += 1.05) items.push({
          position: [x, 0.066, z + side * 7.1], scale: [0.55, 0.014, 2.7], color: '#eee7d6',
        });
      }
    }
    return items;
  }, []);

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
    () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, metalness: 0 }),
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
      <mesh geometry={surface} receiveShadow raycast={() => {}}>
        <meshStandardMaterial map={asphalt} bumpMap={asphalt} bumpScale={0.025} roughness={0.92} color="#a4aca9" />
      </mesh>
      <Instances geometry={geometry} material={material} items={paint} interactive={false} receiveShadow />
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
