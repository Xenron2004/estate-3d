'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { MODERN_APARTMENTS, APARTMENT_FLOOR_HEIGHT } from '@/lib/data/apartment-district';
import { useExplorerStore } from '@/lib/store';
import Instances, { type InstanceDef } from './Instances';

const WHITE = '#e4e7e4';
const CHARCOAL = '#4a535a';
const DARK = '#27343b';
const FRAME = '#26363e';

/** Five contemporary residences with deep window grids, stepped roofs and planted terraces. */
export default function ModernApartments({ quality = 'high' }: { quality?: 'high' | 'low' }) {
  const dusk = useExplorerStore((state) => state.timeOfDay === 'dusk');
  const detailed = quality === 'high';
  const geometry = useMemo(() => ({
    box: new THREE.BoxGeometry(1, 1, 1),
    leaf: new THREE.SphereGeometry(1, 10, 8),
    cypress: new THREE.ConeGeometry(1, 1, 12),
    cylinder: new THREE.CylinderGeometry(1, 1, 1, 10),
  }), []);
  const materials = useMemo(() => ({
    wall: new THREE.MeshStandardMaterial({ roughness: 0.73 }),
    stone: new THREE.MeshStandardMaterial({ roughness: 0.87 }),
    recess: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
    glass: new THREE.MeshPhysicalMaterial({ roughness: 0.12, metalness: 0.14, clearcoat: 0.8, clearcoatRoughness: 0.1, envMapIntensity: 1.25 }),
    interior: new THREE.MeshStandardMaterial({ roughness: 0.4, emissive: '#ffd6a4', emissiveIntensity: 0 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.37, metalness: 0.6 }),
    timber: new THREE.MeshStandardMaterial({ roughness: 0.68 }),
    foliage: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#fff4df', emissive: '#ffcc8c', emissiveIntensity: 0 }),
  }), []);
  useEffect(() => {
    materials.interior.emissiveIntensity = dusk ? 1.0 : 0;
    materials.lamp.emissiveIntensity = dusk ? 1.8 : 0;
  }, [materials, dusk]);
  useEffect(() => () => {
    Object.values(geometry).forEach((item) => item.dispose());
    Object.values(materials).forEach((item) => item.dispose());
  }, [geometry, materials]);

  const parts = useMemo(() => {
    const wall: InstanceDef[] = [], stone: InstanceDef[] = [], recess: InstanceDef[] = [];
    const glass: InstanceDef[] = [], interior: InstanceDef[] = [], metal: InstanceDef[] = [];
    const timber: InstanceDef[] = [], foliage: InstanceDef[] = [], cypress: InstanceDef[] = [];
    const trunks: InstanceDef[] = [], lamps: InstanceDef[] = [];
    const add = (items: InstanceDef[], x: number, y: number, z: number, width: number, height: number, depth: number, color: string) => {
      items.push({ position: [x, y, z], scale: [width, height, depth], color });
    };

    const roofPlant = (x: number, y: number, z: number, tall = true) => {
      add(stone, x, y + 0.28, z, 1.1, 0.56, 1.1, '#89938b');
      add(trunks, x, y + 0.88, z, 0.08, 1.2, 0.08, '#786b50');
      if (tall) add(cypress, x, y + 1.8, z, 0.52, 2.6, 0.52, '#486547');
      else add(foliage, x, y + 0.96, z, 0.65, 0.65, 0.65, '#66834e');
    };

    MODERN_APARTMENTS.forEach(({ x, z, width, depth, floors, front }, towerIndex) => {
      const fh = APARTMENT_FLOOR_HEIGHT;
      const podiumHeight = 4.1;
      const buildingHeight = podiumHeight + floors * fh;
      // A deliberately low podium, with a glazed lobby and robust stone base.
      add(stone, x, 0.24, z, width + 2.5, 0.48, depth + 2.5, '#acb3ad');
      add(recess, x, 2.1, z, width - 0.4, 3.7, depth - 0.4, '#25383d');
      add(wall, x, podiumHeight, z, width + 0.6, 0.48, depth + 0.6, CHARCOAL);
      for (const side of [-1, 1]) {
        const lobbyZ = z + side * depth / 2;
        for (let bay = 0; bay < 8; bay += 1) {
          const wx = x - width / 2 + 2.15 + bay * (width / 8);
          add(glass, wx, 2.12, lobbyZ + side * 0.05, width / 8 - 0.22, 3.37, 0.08, bay % 3 === 0 ? '#899c9c' : '#718d93');
          add(metal, wx - width / 16, 2.1, lobbyZ + side * 0.12, 0.11, 3.62, 0.15, FRAME);
        }
        for (const dx of [-width / 2 + 0.4, -width / 6, width / 6, width / 2 - 0.4]) {
          add(wall, x + dx, 2.1, lobbyZ + side * 0.18, 0.55, 3.8, 0.68, CHARCOAL);
        }
      }
      for (const side of [-1, 1]) {
        for (let bay = 0; bay < 5; bay += 1) {
          const wz = z - depth / 2 + 2.2 + bay * 4.4;
          add(glass, x + side * (width / 2 + 0.05), 2.1, wz, 0.08, 3.35, 4.0, '#779399');
          add(metal, x + side * (width / 2 + 0.12), 2.1, wz - 2.1, 0.15, 3.65, 0.11, FRAME);
        }
      }

      // Every storey is modelled separately; the upper two retreat into a roof garden.
      for (let floor = 0; floor < floors; floor += 1) {
        const setBack = floor >= floors - 2 ? 2.35 : 0;
        const fw = width - setBack * 2;
        const fd = depth - setBack * 2;
        const base = podiumHeight + floor * fh;
        const cy = base + fh / 2;
        const band = floor % 5 === 0 || (towerIndex + floor) % 7 === 0 ? CHARCOAL : WHITE;
        add(recess, x, cy, z, fw - 0.14, fh - 0.1, fd - 0.14, DARK);
        add(wall, x, base + 0.2, z, fw + 0.2, 0.46, fd + 0.2, band);
        for (const side of [-1, 1]) {
          const faceZ = z + side * fd / 2;
          const bayWidth = fw / 8;
          for (let bay = 0; bay < 8; bay += 1) {
            const wx = x - fw / 2 + (bay + 0.5) * bayWidth;
            const loggia = floor > 0 && ((bay + towerIndex) % 4 === 1);
            const glazedWidth = bayWidth - 0.63;
            const glassZ = faceZ + side * (loggia ? 0.04 : 0.16);
            const isLit = (bay * 7 + floor * 3 + towerIndex * 11 + side + 2) % 9 === 0;
            const paneTone = ['#8caaaf', '#708c95', '#a0b1af', '#678791'][(bay + floor + towerIndex) % 4];
            add(isLit ? interior : glass, wx, cy + 0.13, glassZ, glazedWidth, 2.45, 0.08, isLit ? '#d4c5aa' : paneTone);
            // Continuous white piers form the graphic window grid in the reference.
            add(wall, wx - bayWidth / 2, cy + 0.16, faceZ + side * 0.38, 0.57, fh - 0.38, 0.7, band);
            add(metal, wx, cy + 0.14, glassZ + side * 0.075, 0.075, 2.49, 0.12, FRAME);
            add(metal, wx, base + 0.52, glassZ + side * 0.07, glazedWidth, 0.085, 0.13, FRAME);
            add(metal, wx, base + 2.97, glassZ + side * 0.07, glazedWidth, 0.075, 0.13, FRAME);
            if (detailed && !loggia) {
              add(timber, wx + glazedWidth * 0.3, cy + 0.12, glassZ + side * 0.11, 0.44, 2.25, 0.035, '#c3c3b5');
            }
            if (loggia) {
              // Deep projecting balcony slab, side cheeks and an open, slender guardrail.
              add(wall, wx, base + 0.42, faceZ + side * 0.92, bayWidth - 0.55, 0.2, 2.0, band);
              for (const edge of [-1, 1]) {
                add(wall, wx + edge * (bayWidth / 2 - 0.35), cy - 0.06, faceZ + side * 0.78, 0.13, fh - 0.6, 1.75, band);
              }
              add(metal, wx, base + 1.54, faceZ + side * 1.82, bayWidth - 0.59, 0.065, 0.065, FRAME);
              add(glass, wx, base + 1.04, faceZ + side * 1.79, bayWidth - 0.7, 0.9, 0.035, '#87a3a1');
              for (const edge of [-1, 1]) add(metal, wx + edge * (bayWidth / 2 - 0.4), base + 1.0, faceZ + side * 1.82, 0.055, 1.05, 0.06, FRAME);
              if ((floor + bay + towerIndex) % 3 === 0) {
                add(stone, wx + 0.75, base + 0.76, faceZ + side * 0.9, 0.82, 0.55, 0.63, '#929c90');
                add(foliage, wx + 0.75, base + 1.2, faceZ + side * 0.9, 0.5, 0.55, 0.46, '#658153');
              }
            }
          }
          add(wall, x + fw / 2, cy + 0.16, faceZ + side * 0.38, 0.57, fh - 0.38, 0.7, band);
        }

        for (const side of [-1, 1]) {
          const faceX = x + side * fw / 2;
          const bayDepth = fd / 5;
          for (let bay = 0; bay < 5; bay += 1) {
            const wz = z - fd / 2 + (bay + 0.5) * bayDepth;
            add(glass, faceX + side * 0.16, cy + 0.13, wz, 0.08, 2.45, bayDepth - 0.6, '#819da5');
            add(wall, faceX + side * 0.38, cy + 0.16, wz - bayDepth / 2, 0.7, fh - 0.38, 0.55, band);
            add(metal, faceX + side * 0.24, cy + 0.13, wz, 0.12, 2.48, 0.065, FRAME);
          }
          add(wall, faceX + side * 0.38, cy + 0.16, z + fd / 2, 0.7, fh - 0.38, 0.55, band);
        }
        // A light stone coping closes each floor's outer edge crisply.
        for (const side of [-1, 1]) {
          add(wall, x, base + fh - 0.1, z + side * (fd / 2 + 0.24), fw + 0.45, 0.22, 0.34, band);
        }
      }

      const terraceY = podiumHeight + (floors - 2) * fh + 0.43;
      // The setback produces an occupiable planted terrace, not a cap on a solid box.
      for (const side of [-1, 1]) {
        add(wall, x, terraceY + 0.42, z + side * (depth / 2 - 0.12), width + 0.1, 0.65, 0.26, WHITE);
        add(foliage, x, terraceY + 0.15, z + side * (depth / 2 - 1.2), width - 1.5, 0.12, 1.65, '#687f4c');
        for (let px = -width / 2 + 2; px <= width / 2 - 2; px += 3.3) roofPlant(x + px, terraceY, z + side * (depth / 2 - 1.18));
      }
      const roofY = buildingHeight + 0.2;
      add(wall, x, roofY, z, width - 4.2, 0.38, depth - 4.2, WHITE);
      for (const side of [-1, 1]) {
        add(wall, x, roofY + 0.44, z + side * (depth / 2 - 2.25), width - 4.1, 0.7, 0.25, WHITE);
        add(wall, x + side * (width / 2 - 2.25), roofY + 0.44, z, 0.25, 0.7, depth - 4.1, WHITE);
      }
      add(foliage, x + 4.8, roofY + 0.26, z, 12, 0.14, 11.7, '#718b53');
      // Service core and slatted screening give the rooftop a realistic silhouette.
      add(wall, x - 8.3, roofY + 1.43, z - 2.6, 6.6, 2.8, 6.2, CHARCOAL);
      add(wall, x - 8.3, roofY + 2.9, z - 2.6, 7.0, 0.2, 6.6, '#6c777c');
      for (let i = 0; i < 9; i += 1) add(metal, x - 11.3 + i * 0.75, roofY + 1.4, z - 5.75, 0.25, 2.3, 0.15, '#394850');
      for (const px of [1, 6, 11]) roofPlant(x + px, roofY + 0.2, z - 5.7, false);
      for (const px of [1, 11]) for (const dz of [-2, 4.5]) add(metal, x + px, roofY + 1.6, z + dz, 0.1, 2.7, 0.1, '#4d5b5d');
      for (let i = 0; i < 15; i += 1) add(timber, x + 6, roofY + 3.0, z - 2.4 + i * 0.52, 11.3, 0.12, 0.18, '#b2a582');

      if (detailed) {
        // Sparse vertical climbers follow a trellis down the corner elevation.
        for (const sx of [-1, 1]) {
          const vineX = x + sx * (width / 2 + 0.44);
          for (let y = podiumHeight + 1; y < terraceY; y += 0.65) {
            add(metal, vineX, y, z + front * (depth / 2 - 2.0), 0.035, 0.8, 0.04, '#607464');
            const wave = Math.sin(y * 1.7 + towerIndex) * 0.23;
            add(foliage, vineX + sx * 0.16, y, z + front * (depth / 2 - 2.0) + wave, 0.24, 0.47, 0.38, y % 2 > 1 ? '#617e4d' : '#78915e');
          }
        }
      }

      // Double-height entry, fine canopy, doors and a warm lobby pendant.
      const entryZ = z + front * (depth / 2 + 0.2);
      add(metal, x, 3.56, entryZ + front * 1.15, 9.8, 0.18, 2.7, CHARCOAL);
      add(timber, x, 3.44, entryZ + front * 1.15, 9.45, 0.08, 2.4, '#ad9c7b');
      for (const px of [-4.4, 4.4]) add(metal, x + px, 1.84, entryZ + front * 2.1, 0.15, 3.5, 0.15, '#49565a');
      for (const px of [-1.5, 0, 1.5]) add(metal, x + px, 1.95, entryZ + front * 0.18, 0.11, 3.4, 0.12, '#263a40');
      for (const px of [-0.23, 0.23]) add(metal, x + px, 1.9, entryZ + front * 0.28, 0.045, 0.65, 0.065, '#c5c4b0');
      add(lamps, x, 3.1, entryZ - front * 1.6, 2.1, 0.12, 0.48, '#fff3d9');
      for (const px of [-6.1, 6.1]) {
        add(stone, x + px, 0.62, entryZ + front * 1.45, 1.7, 1.0, 1.15, '#8e9b91');
        add(foliage, x + px, 1.48, entryZ + front * 1.45, 0.85, 0.86, 0.63, '#668456');
      }
    });
    return { wall, stone, recess, glass, interior, metal, timber, foliage, cypress, trunks, lamps };
  }, [detailed]);

  const shadows = quality === 'high';
  return (
    <group name="Five modern apartment residences">
      <Instances geometry={geometry.box} material={materials.wall} items={parts.wall} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.stone} items={parts.stone} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.recess} items={parts.recess} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.glass} items={parts.glass} interactive={false} />
      <Instances geometry={geometry.box} material={materials.interior} items={parts.interior} interactive={false} />
      <Instances geometry={geometry.box} material={materials.metal} items={parts.metal} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.timber} items={parts.timber} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={geometry.leaf} material={materials.foliage} items={parts.foliage} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={geometry.cypress} material={materials.foliage} items={parts.cypress} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={geometry.cylinder} material={materials.timber} items={parts.trunks} interactive={false} />
      <Instances geometry={geometry.box} material={materials.lamp} items={parts.lamps} interactive={false} />
    </group>
  );
}
