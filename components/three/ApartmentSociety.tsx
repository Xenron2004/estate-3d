'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { useExplorerStore } from '@/lib/store';
import Instances, { type InstanceDef } from './Instances';

// The northern row clears the street rather than projecting into its carriageway.
const TOWERS = [
  { x: 49.43, z: 73.7, floors: 5, front: 1 },
  { x: 68.93, z: 73.7, floors: 6, front: 1 },
  { x: 88.43, z: 73.7, floors: 5, front: 1 },
  { x: 49.43, z: 106.8, floors: 5, front: -1 },
  { x: 68.93, z: 106.8, floors: 4, front: -1 },
  { x: 88.43, z: 106.8, floors: 5, front: -1 },
];
const FLOOR_HEIGHT = 3.1;
const WIDTH = 11.8;
const DEPTH = 14.8;

export default function ApartmentSociety({ quality = 'high' }: { quality?: 'high' | 'low' }) {
  const dusk = useExplorerStore((state) => state.timeOfDay === 'dusk');
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const softBox = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.018), []);
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const data = useMemo(() => {
    const walls: InstanceDef[] = [];
    const stone: InstanceDef[] = [];
    const frames: InstanceDef[] = [];
    const recesses: InstanceDef[] = [];
    const glass: InstanceDef[] = [];
    const litGlass: InstanceDef[] = [];
    const timber: InstanceDef[] = [];
    const metal: InstanceDef[] = [];
    const foliage: InstanceDef[] = [];
    const paving: InstanceDef[] = [];
    const add = (items: InstanceDef[], position: InstanceDef['position'], scale: InstanceDef['scale'], color: string, rotation?: InstanceDef['rotation']) => items.push({ position, scale, color, rotation });

    TOWERS.forEach(({ x, z, floors, front }, towerIndex) => {
      const height = floors * FLOOR_HEIGHT;
      const facade = ['#eadfc9', '#e0dcd0', '#eee6d6'][towerIndex % 3];
      add(walls, [x, height / 2 + 0.42, z], [WIDTH, height, DEPTH], facade);
      add(stone, [x, 0.37, z], [WIDTH + 0.65, 0.7, DEPTH + 0.65], '#b6ab94');
      add(walls, [x, height / 2 + 0.35, z - front * 7.38], [2.05, height, 0.38], '#c0b49b');
      for (const dx of [-5.55, 5.55]) {
        add(stone, [x + dx, height / 2 + 0.4, z + front * 7.45], [0.48, height, 0.34], '#d1c5ad');
      }
      for (let floor = 0; floor < floors; floor += 1) {
        const baseY = 0.42 + floor * FLOOR_HEIGHT;
        const wy = baseY + 1.55;
        for (const side of [-1, 1]) {
          add(stone, [x, baseY + 2.93, z + side * 7.46], [WIDTH + 0.16, 0.17, 0.31], '#f3ead9');
          for (const bay of [-1, 0, 1]) {
            const wx = x + bay * 3.48;
            const wz = z + side * 7.43;
            const isLit = (floor * 7 + towerIndex * 11 + bay + side + 3) % 4 === 0;
            add(recesses, [wx, wy, wz], [1.88, 1.91, 0.12], '#344644');
            add(isLit ? litGlass : glass, [wx, wy, wz + side * 0.075], [1.57, 1.6, 0.08], isLit ? '#efc996' : '#72949b');
            for (const edge of [-1, 1]) {
              add(frames, [wx + edge * 0.86, wy, wz + side * 0.16], [0.1, 1.89, 0.21], '#ece3cf');
              add(frames, [wx, wy + edge * 0.89, wz + side * 0.16], [1.8, 0.1, 0.21], '#eee5d2');
            }
            add(metal, [wx, wy, wz + side * 0.19], [0.055, 1.62, 0.08], '#425856');
            add(stone, [wx, wy - 1.0, wz + side * 0.22], [2.02, 0.13, 0.47], '#c7b99f');
            if (bay === 0 && floor > 0) add(timber, [wx, wy + 1.02, wz + side * 0.35], [2.3, 0.12, 0.9], '#a67b50');
          }
          for (const bay of [-1, 1]) {
            const wx = x + side * 5.94;
            const wz = z + bay * 4.1;
            add(recesses, [wx, wy, wz], [0.12, 1.83, 1.95], '#344644');
            add(glass, [wx + side * 0.08, wy, wz], [0.08, 1.56, 1.67], '#6f9195');
            for (const edge of [-1, 1]) {
              add(frames, [wx + side * 0.16, wy, wz + edge * 0.91], [0.21, 1.83, 0.1], '#eee5d2');
              add(frames, [wx + side * 0.16, wy + edge * 0.86, wz], [0.21, 0.1, 1.92], '#eee5d2');
            }
            add(metal, [wx + side * 0.19, wy, wz], [0.08, 1.57, 0.055], '#425856');
            add(stone, [wx + side * 0.22, wy - 0.98, wz], [0.47, 0.13, 2.08], '#c7b99f');
          }
        }
        // Balconies face the arrival courts with slender, separated balusters.
        if (floor > 0) {
          for (const bay of [-1, 1]) {
            const bx = x + bay * 3.48;
            const bz = z + front * 8.16;
            const by = baseY - 0.08;
            add(stone, [bx, by, bz], [2.9, 0.24, 1.8], '#e7dcc7');
            add(metal, [bx, by + 1.12, bz + front * 0.84], [2.85, 0.065, 0.075], '#4e5e57');
            add(metal, [bx, by + 0.24, bz + front * 0.84], [2.85, 0.06, 0.06], '#4e5e57');
            for (let post = 0; post < 8; post += 1) add(metal, [bx - 1.34 + post * 0.385, by + 0.68, bz + front * 0.84], [0.045, 0.89, 0.045], '#52625b');
            for (const edge of [-1, 1]) {
              add(metal, [bx + edge * 1.36, by + 1.12, bz], [0.065, 0.065, 1.7], '#4e5e57');
              add(metal, [bx + edge * 1.36, by + 0.68, bz], [0.045, 0.89, 0.045], '#4e5e57');
            }
            if ((floor + towerIndex + bay) % 2 === 0) {
              add(timber, [bx + 0.8, by + 0.4, bz], [0.67, 0.54, 0.6], '#af7950');
              add(foliage, [bx + 0.8, by + 0.77, bz], [0.46, 0.4, 0.44], '#6c8b4e');
            }
          }
        }
      }
      const ez = z + front * 7.5;
      add(recesses, [x, 1.55, ez], [2.7, 2.58, 0.16], '#344644');
      add(glass, [x, 1.55, ez + front * 0.12], [2.36, 2.3, 0.1], '#688b88');
      for (const dx of [-1.25, 0, 1.25]) add(metal, [x + dx, 1.55, ez + front * 0.21], [0.09, 2.5, 0.1], '#42544b');
      add(timber, [x, 3.04, ez + front * 0.8], [4.2, 0.24, 2.0], '#9f784f');
      for (const dx of [-1.8, 1.8]) add(metal, [x + dx, 1.5, ez + front * 1.55], [0.13, 3, 0.13], '#56635a');
      for (let step = 0; step < 3; step += 1) add(stone, [x, 0.08 + step * 0.11, ez + front * (1.85 - step * 0.28)], [3.9, 0.16 + step * 0.11, 0.42], '#cbbfa8');
      // A roof garden, service room, timber pergola and tilted solar panels.
      add(stone, [x, height + 0.55, z], [12.5, 0.32, 15.5], '#d1c4ab');
      for (const side of [-1, 1]) {
        add(walls, [x + side * 5.9, height + 0.96, z], [0.2, 0.6, 14.9], '#e4dac5');
        add(walls, [x, height + 0.96, z + side * 7.35], [11.9, 0.6, 0.2], '#e4dac5');
      }
      add(walls, [x - 2.8, height + 1.6, z - 3.8], [3.3, 2.0, 3.6], '#d5c9b0');
      add(stone, [x - 2.8, height + 2.65, z - 3.8], [3.7, 0.15, 4], '#b4a990');
      for (const dx of [-1.7, 1.7]) for (const dz of [-1.9, 1.9]) add(timber, [x + dx, height + 1.6, z + 2.6 + dz], [0.14, 1.9, 0.14], '#a27d52');
      for (let slat = 0; slat < 10; slat += 1) add(timber, [x - 1.9 + slat * 0.42, height + 2.63, z + 2.6], [0.17, 0.12, 4.5], '#a9855a');
      for (const dx of [0.4, 3]) {
        add(metal, [x + dx, height + 1.08, z - 3.6], [2.15, 0.1, 3.3], '#385a65', [-0.22, 0, 0]);
        add(frames, [x + dx, height + 1.09, z - 3.6], [0.045, 0.12, 3.3], '#a6b6ad', [-0.22, 0, 0]);
      }
    });
    // Courts stop at the street edges, preserving the continuous carriageway.
    for (const cz of [85.0, 98.7]) {
      add(paving, [69, 0.1, cz], [56, 0.16, 3.6], '#c9bba3');
      for (const px of [43, 95]) {
        add(stone, [px, 0.33, cz], [5, 0.5, 1.3], '#b4a58b');
        add(foliage, [px, 0.68, cz], [2.35, 0.43, 0.53], '#6b8752');
      }
      for (const px of [58, 79]) {
        add(timber, [px, 0.55, cz], [2.3, 0.14, 0.67], '#9c7950');
        add(timber, [px, 0.98, cz + 0.3], [2.3, 0.6, 0.12], '#9c7950');
        for (const dx of [-0.85, 0.85]) add(metal, [px + dx, 0.3, cz], [0.11, 0.55, 0.58], '#526057');
      }
    }
    return { walls, stone, frames, recesses, glass, litGlass, timber, metal, foliage, paving };
  }, []);
  const materials = useMemo(() => ({
    plaster: new THREE.MeshStandardMaterial({ roughness: 0.84 }),
    stone: new THREE.MeshStandardMaterial({ roughness: 0.88 }),
    recess: new THREE.MeshStandardMaterial({ roughness: 0.94 }),
    glass: new THREE.MeshPhysicalMaterial({ roughness: 0.17, metalness: 0.18, clearcoat: 0.8, envMapIntensity: 1.15 }),
    litGlass: new THREE.MeshStandardMaterial({ roughness: 0.32, emissive: '#ffd49a', emissiveIntensity: 0.08 }),
    timber: new THREE.MeshStandardMaterial({ roughness: 0.72 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.55 }),
    leaves: new THREE.MeshStandardMaterial({ roughness: 0.92 }),
  }), []);
  useEffect(() => {
    materials.litGlass.emissiveIntensity = dusk ? 1.25 : 0.08;
  }, [dusk, materials]);
  useEffect(() => () => {
    Object.values(materials).forEach((material) => material.dispose());
    box.dispose();
    softBox.dispose();
    sphere.dispose();
  }, [materials, box, softBox, sphere]);
  const shadows = quality === 'high';
  return (
    <group>
      <Instances geometry={softBox} material={materials.plaster} items={data.walls} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={box} material={materials.stone} items={data.stone} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={box} material={materials.plaster} items={data.frames} receiveShadow interactive={false} />
      <Instances geometry={box} material={materials.recess} items={data.recesses} interactive={false} />
      <Instances geometry={box} material={materials.glass} items={data.glass} interactive={false} />
      <Instances geometry={box} material={materials.litGlass} items={data.litGlass} interactive={false} />
      <Instances geometry={box} material={materials.timber} items={data.timber} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={box} material={materials.metal} items={data.metal} receiveShadow interactive={false} />
      <Instances geometry={sphere} material={materials.leaves} items={data.foliage} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={box} material={materials.stone} items={data.paving} receiveShadow interactive={false} />
    </group>
  );
}
