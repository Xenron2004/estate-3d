'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import Instances, { type InstanceDef } from './Instances';
import { GREEN, SITE } from '@/lib/data/township';

export default function Structures({ quality }: { quality: 'high' | 'low' }) {
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const cylinder = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 12), []);

  const concrete = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c4bcaa', roughness: 0.92, metalness: 0 }),
    [],
  );
  const plaster = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e4dccb', roughness: 0.85, metalness: 0 }),
    [],
  );
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#39403b', roughness: 0.6, metalness: 0.15 }),
    [],
  );
  const glass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#22333a',
        roughness: 0.18,
        metalness: 0.55,
        transparent: true,
        opacity: 0.85,
      }),
    [],
  );
  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#7c7468', roughness: 0.45, metalness: 0.6 }),
    [],
  );
  const roof = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b8b0a0', roughness: 0.9, metalness: 0 }),
    [],
  );

  /* ---------------------------------------------------------- boundary wall */
  const wall = useMemo(() => {
    const items: InstanceDef[] = [];
    const wallX = SITE.maxX - SITE.wallInset;
    const wallZ0 = SITE.minZ + SITE.wallInset;
    const wallZ1 = SITE.maxZ - SITE.wallInset;
    const h = 1.9;

    const run = (axis: 'x' | 'z', fixed: number, from: number, to: number, skip: [number, number] | null) => {
      const spans: [number, number][] = skip
        ? [
            [from, Math.max(from, skip[0])],
            [Math.min(to, skip[1]), to],
          ]
        : [[from, to]];
      for (const [a, b] of spans) {
        if (b - a < 0.5) continue;
        const mid = (a + b) / 2;
        const length = b - a;
        items.push({
          position: axis === 'x' ? [mid, h / 2, fixed] : [fixed, h / 2, mid],
          scale: axis === 'x' ? [length, h, 0.34] : [0.34, h, length],
          color: '#cdc5b3',
        });
        items.push({
          position: axis === 'x' ? [mid, h + 0.08, fixed] : [fixed, h + 0.08, mid],
          scale: axis === 'x' ? [length, 0.16, 0.48] : [0.48, 0.16, length],
          color: '#b7af9d',
        });
        // piers
        const count = Math.max(1, Math.round(length / 6));
        for (let i = 0; i <= count; i += 1) {
          const at = a + (length * i) / count;
          items.push({
            position: axis === 'x' ? [at, h / 2 + 0.2, fixed] : [fixed, h / 2 + 0.2, at],
            scale: axis === 'x' ? [0.6, h + 0.4, 0.6] : [0.6, h + 0.4, 0.6],
            color: '#d5cdba',
          });
        }
      }
    };

    run('x', wallZ0, -wallX, wallX, [-7, 7]);
    run('x', wallZ1, -wallX, wallX, null);
    run('z', -wallX, wallZ0, wallZ1, null);
    run('z', wallX, wallZ0, wallZ1, null);
    return items;
  }, []);

  /* ------------------------------------------------------------- gate area */
  const gate = useMemo(() => {
    const items: InstanceDef[] = [];
    // piers
    for (const x of [-7.4, 7.4]) {
      items.push({ position: [x, 1.8, SITE.minZ + 2.4], scale: [1.5, 3.6, 1.5], color: '#d9d0bc' });
      items.push({ position: [x, 3.72, SITE.minZ + 2.4], scale: [1.8, 0.24, 1.8], color: '#b3aa97' });
    }
    // canopy
    items.push({ position: [0, 3.9, SITE.minZ + 5.4], scale: [17, 0.3, 5.2], color: '#cdc4b1' });
    for (const x of [-6.2, 6.2]) {
      items.push({ position: [x, 1.9, SITE.minZ + 7.4], scale: [0.36, 3.8, 0.36], color: '#b9b09d' });
    }
    // boom barrier housing + raised arm
    items.push({ position: [4.6, 0.65, SITE.minZ + 1.2], scale: [0.6, 1.3, 0.6], color: '#c0673f' });
    items.push({
      position: [1.9, 1.75, SITE.minZ + 1.2],
      scale: [5.6, 0.16, 0.16],
      rotation: [0, 0, 0.35],
      color: '#e8e2d4',
    });
    // sliding gate leaves
    for (const x of [-3.6, 3.6]) {
      for (let i = 0; i < 9; i += 1) {
        items.push({
          position: [x - 2.6 + i * 0.65, 1.3, SITE.minZ + 2.2],
          scale: [0.1, 2.4, 0.1],
          color: '#8f8878',
        });
      }
      items.push({
        position: [x, 2.5, SITE.minZ + 2.2],
        scale: [5.6, 0.14, 0.14],
        color: '#8f8878',
      });
    }
    // guard cabin
    items.push({ position: [-11.5, 1.6, SITE.minZ + 5.4], scale: [4.6, 3.2, 3.4], color: '#ded6c4' });
    items.push({ position: [-11.5, 3.35, SITE.minZ + 5.4], scale: [5.4, 0.3, 4.2], color: '#b5ac99' });
    items.push({ position: [-11.5, 1.9, SITE.minZ + 3.65], scale: [3.6, 1.5, 0.14], color: '#2b383c' });
    items.push({ position: [-9.3, 1.1, SITE.minZ + 3.7], scale: [0.1, 2.1, 0.1], color: '#6f6a5e' });
    return items;
  }, []);

  /* ---------------------------------------------------------- clubhouse */
  const clubhouse = useMemo(() => {
    const items: InstanceDef[] = [];
    const { minX, maxX, minZ, maxZ } = GREEN.clubhouse;
    const w = maxX - minX;
    const d = maxZ - minZ;
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    items.push({ position: [cx, 2.2, cz], scale: [w, 4.4, d], color: '#e6ddc9' });
    items.push({ position: [cx, 4.55, cz], scale: [w + 1.4, 0.4, d + 1.4], color: '#b5ac98' });
    items.push({ position: [cx, 4.85, cz], scale: [w - 1.6, 0.3, d - 1.6], color: '#cbc2af' });
    // plinth
    items.push({ position: [cx, 0.22, cz], scale: [w + 2.2, 0.44, d + 2.2], color: '#b3aa97' });
    return items;
  }, []);

  const clubGlazing = useMemo(() => {
    const { minX, maxX, minZ, maxZ } = GREEN.clubhouse;
    const cx = (minX + maxX) / 2;
    const items: InstanceDef[] = [];
    // south elevation glazing
    items.push({ position: [cx, 2.5, minZ - 0.08], scale: [maxX - minX - 6, 2.4, 0.16], color: '#22333a' });
    // east elevation
    items.push({ position: [maxX + 0.08, 2.5, (minZ + maxZ) / 2], scale: [0.16, 2.4, maxZ - minZ - 7], color: '#22333a' });
    // veranda slab + posts
    items.push({ position: [cx, 3.05, minZ - 3.4], scale: [maxX - minX - 4, 0.22, 6.4], color: '#cfc6b3' });
    for (let i = 0; i < 6; i += 1) {
      const x = minX + 3 + i * ((maxX - minX - 6) / 5);
      items.push({ position: [x, 1.5, minZ - 6.1], scale: [0.3, 3, 0.3], color: '#d6cdb9' });
    }
    return items;
  }, []);

  /* --------------------------------------------------------- play equipment */
  const play = useMemo(() => {
    const items: InstanceDef[] = [];
    const px = -14;
    const pz = 96;
    // slide
    items.push({ position: [px, 1.4, pz], scale: [1.9, 0.18, 5.4], rotation: [-0.52, 0, 0], color: '#d2593f' });
    items.push({ position: [px, 1.05, pz - 2.9], scale: [1.9, 0.2, 1.6], color: '#e0b04a' });
    for (const dx of [-0.8, 0.8]) {
      for (const dz of [-0.6, 0.6]) {
        items.push({ position: [px + dx, 0.55, pz - 2.9 + dz], scale: [0.12, 1.1, 0.12], color: '#9c8f76' });
      }
    }
    // swing frame
    for (const dx of [-3.2, 3.2]) {
      items.push({ position: [px + 8 + dx, 1.5, pz + 1], scale: [0.16, 3, 0.16], rotation: [0, 0, dx > 0 ? -0.16 : 0.16], color: '#6f7c74' });
      items.push({ position: [px + 8 + dx, 1.5, pz - 1], scale: [0.16, 3, 0.16], rotation: [0, 0, dx > 0 ? -0.16 : 0.16], color: '#6f7c74' });
    }
    items.push({ position: [px + 8, 2.95, pz], scale: [6.6, 0.16, 0.16], color: '#6f7c74' });
    for (const dx of [-1.3, 1.3]) {
      items.push({ position: [px + 8 + dx, 1.9, pz], scale: [0.05, 2.1, 0.05], color: '#5d5a50' });
      items.push({ position: [px + 8 + dx, 0.85, pz], scale: [0.55, 0.1, 0.36], color: '#c0673f' });
    }
    // sandpit
    items.push({ position: [px + 16, 0.18, pz - 1], scale: [7, 0.36, 5], color: '#cbbb96' });
    // mound
    items.push({ position: [px + 16, 0.1, pz + 9], scale: [9, 1.2, 7], color: '#7f9155' });
    return items;
  }, []);

  /* ------------------------------------------------------------- gazebo */
  const gazebo = useMemo(() => {
    const items: InstanceDef[] = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2;
      items.push({
        position: [Math.cos(angle) * 4, 1.5, 150 + Math.sin(angle) * 4],
        scale: [0.22, 3, 0.22],
        color: '#d8cfbb',
      });
    }
    return items;
  }, []);

  return (
    <group>
      <Instances geometry={box} material={concrete} items={wall} castShadow={quality === 'high'} receiveShadow />
      <Instances geometry={box} material={concrete} items={gate} castShadow={quality === 'high'} receiveShadow />
      <Instances geometry={box} material={plaster} items={clubhouse} castShadow={quality === 'high'} receiveShadow />
      <Instances geometry={box} material={glass} items={clubGlazing} />
      <Instances geometry={box} material={metal} items={play} castShadow={quality === 'high'} receiveShadow />
      <Instances geometry={box} material={plaster} items={gazebo} castShadow={quality === 'high'} />

      {/* gazebo roof */}
      <mesh position={[0, 3.4, 150]} castShadow>
        <coneGeometry args={[5.4, 2.4, 6]} />
        <meshStandardMaterial color="#8e7a5c" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.08, 150]} receiveShadow>
        <cylinderGeometry args={[4.6, 4.8, 0.16, 16]} />
        <meshStandardMaterial color="#bdb4a1" roughness={0.95} />
      </mesh>

      {/* clubhouse entrance canopy sign */}
      <mesh position={[0, 5.4, GREEN.clubhouse.minZ - 0.3]}>
        <boxGeometry args={[7.4, 1.1, 0.16]} />
        <meshStandardMaterial color="#3d4a42" roughness={0.6} />
      </mesh>
    </group>
  );
}
