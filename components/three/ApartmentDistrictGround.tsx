'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { DISTRICT_BOUNDS, MODERN_APARTMENTS } from '@/lib/data/apartment-district';
import { createSurfaceTexture } from '@/lib/three/surfaces';
import { useExplorerStore } from '@/lib/store';
import Instances, { type InstanceDef } from './Instances';

/** Connected streets and gardens for the five-building northern apartment precinct. */
export default function ApartmentDistrictGround({ quality = 'high' }: { quality?: 'high' | 'low' }) {
  const dusk = useExplorerStore((state) => state.timeOfDay === 'dusk');
  const geometry = useMemo(() => ({
    box: new THREE.BoxGeometry(1, 1, 1),
    crown: new THREE.SphereGeometry(1, 14, 10),
    trunk: new THREE.CylinderGeometry(0.75, 1, 1, 10),
  }), []);
  const textures = useMemo(() => ({
    asphalt: createSurfaceTexture('asphalt'),
    stone: createSurfaceTexture('stone'),
  }), []);
  const materials = useMemo(() => ({
    matte: new THREE.MeshStandardMaterial({ roughness: 0.91 }),
    paving: new THREE.MeshStandardMaterial({ roughness: 0.88, bumpMap: textures.stone, bumpScale: 0.018 }),
    asphalt: new THREE.MeshStandardMaterial({ roughness: 0.94, bumpMap: textures.asphalt, bumpScale: 0.018 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.32 }),
    glass: new THREE.MeshStandardMaterial({ roughness: 0.17, metalness: 0.2, envMapIntensity: 0.85 }),
    leaves: new THREE.MeshStandardMaterial({ roughness: 0.94 }),
    lamps: new THREE.MeshStandardMaterial({ emissive: '#ffe1a4', emissiveIntensity: 0 }),
  }), [textures]);

  useEffect(() => {
    materials.lamps.emissiveIntensity = dusk ? 1.9 : 0;
  }, [materials, dusk]);
  useEffect(() => () => {
    Object.values(geometry).forEach((item) => item.dispose());
    Object.values(textures).forEach((item) => item.dispose());
    Object.values(materials).forEach((item) => item.dispose());
  }, [geometry, textures, materials]);

  const parts = useMemo(() => {
    const ground: InstanceDef[] = [], roads: InstanceDef[] = [], paving: InstanceDef[] = [];
    const paint: InstanceDef[] = [], stone: InstanceDef[] = [], metal: InstanceDef[] = [];
    const trunks: InstanceDef[] = [], foliage: InstanceDef[] = [], flowers: InstanceDef[] = [];
    const lamps: InstanceDef[] = [], cars: InstanceDef[] = [], glazing: InstanceDef[] = [];
    const add = (items: InstanceDef[], x: number, y: number, z: number, width: number, height: number, depth: number, color: string) => {
      items.push({ position: [x, y, z], scale: [width, height, depth], color });
    };
    const districtWidth = DISTRICT_BOUNDS.maxX - DISTRICT_BOUNDS.minX;
    const districtDepth = DISTRICT_BOUNDS.maxZ - DISTRICT_BOUNDS.minZ;
    const centerZ = (DISTRICT_BOUNDS.minZ + DISTRICT_BOUNDS.maxZ) / 2;
    add(ground, 0, -0.035, centerZ, districtWidth, 0.12, districtDepth, '#70934d');
    add(ground, 0, -0.035, 188, 22, 0.12, 12, '#74984f');

    // A continuous 30 ft access street meets the original central spine through the wall opening.
    add(roads, 0, 0.045, 206.715, 9.14, 0.04, 49.43, '#424a4d');
    add(roads, 0, 0.045, 236, 192, 0.04, 9.14, '#424a4d');
    for (const side of [-1, 1]) {
      // The entrance to each parking court interrupts the kerb and raised sidewalk.
      for (const [from, to] of [[182, 221.25], [226.75, 231.2]]) {
        add(paving, side * 5.95, 0.105, (from + to) / 2, 2.15, 0.17, to - from, '#d4d3c7');
        add(stone, side * 4.78, 0.13, (from + to) / 2, 0.25, 0.2, to - from, '#c4c5bb');
      }
      // Opposite sidewalks and planters frame a shared arrival street rather than isolated pads.
      const pathSpans = side < 0 ? [[-96, -7.1], [7.1, 96]] : [[-96, 96]];
      const kerbSpans = side < 0 ? [[-96, -4.91], [4.91, 96]] : [[-96, 96]];
      for (const [from, to] of pathSpans) add(paving, (from + to) / 2, 0.105, 236 + side * 6.15, to - from, 0.17, 2.55, '#d4d3c7');
      for (const [from, to] of kerbSpans) add(stone, (from + to) / 2, 0.13, 236 + side * 4.78, to - from, 0.2, 0.25, '#c4c5bb');
      add(stone, side * 97.2, 0.12, 236, 2.4, 0.2, 11.9, '#c8c9bf');
    }
    // Keep the footpaths and kerbs open across the T junction.
    // Short centre markings provide scale without creating a bright grid across the architecture.
    for (let z = 189; z < 227; z += 7) add(paint, 0, 0.069, z, 0.14, 0.01, 2.7, '#e4e6df');
    for (let x = -91; x < 94; x += 7) {
      if (Math.abs(x) > 8) add(paint, x, 0.069, 236, 2.7, 0.01, 0.14, '#e4e6df');
    }
    for (let x = -3.6; x <= 3.6; x += 1.05) add(paint, x, 0.071, 226.6, 0.55, 0.012, 2.7, '#e9e9de');

    for (const building of MODERN_APARTMENTS) {
      const frontEdge = building.z + building.front * (building.depth / 2 + 1.25);
      const walkEdge = 236 - building.front * 6.15;
      add(paving, building.x, 0.12, (frontEdge + walkEdge) / 2, 4.5, 0.2, Math.abs(frontEdge - walkEdge) + 0.8, '#d8d6cb');
      for (const side of [-1, 1]) {
        const x = building.x + side * 11.5;
        const z = frontEdge + building.front * 1.6;
        add(stone, x, 0.38, z, 6.1, 0.65, 1.7, '#b8bcb2');
        add(foliage, x, 0.95, z, 2.8, 0.55, 0.75, '#557c42');
        add(foliage, x + 1.5, 1.0, z, 1.15, 0.6, 0.65, '#6c914e');
        add(foliage, x - 1.5, 1.0, z, 1.15, 0.6, 0.65, '#678b47');
        if (quality === 'high') {
          for (const dx of [-2, -1, 0, 1, 2]) add(flowers, x + dx, 1.42, z, 0.18, 0.12, 0.18, '#dac8a7');
        }
      }
    }

    // Small parking courts occupy the open land either side of the access lane.
    for (const side of [-1, 1]) {
      add(roads, side * 24, 0.04, 211.2, 18.5, 0.03, 29.4, '#51595a');
      add(roads, side * 10.7, 0.04, 224, 12.3, 0.03, 5.5, '#51595a');
      for (let bay = 0; bay < 5; bay += 1) {
        const z = 199.5 + bay * 5.5;
        add(paint, side * 27.5, 0.061, z, 10.5, 0.014, 0.12, '#dde1d5');
        add(paint, side * 32.6, 0.061, z + 2.65, 0.12, 0.014, 5.3, '#dde1d5');
        if (bay % 2 === 0) {
          const x = side * 28;
          add(cars, x, 0.68, z + 2.7, 4.45, 0.95, 1.95, ['#879690', '#d4d5cc', '#536673'][bay % 3]);
          add(glazing, x - side * 0.2, 1.38, z + 2.7, 2.3, 0.55, 1.72, '#5d7679');
          for (const dx of [-1.35, 1.35]) for (const dz of [-0.88, 0.88]) {
            add(metal, x + dx, 0.4, z + 2.7 + dz, 0.72, 0.55, 0.23, '#2b3335');
          }
        }
      }
    }

    const plantTree = (x: number, z: number, scale = 1) => {
      add(trunks, x, 1.9 * scale, z, 0.28 * scale, 3.8 * scale, 0.28 * scale, '#8d785b');
      add(foliage, x, 4.5 * scale, z, 1.95 * scale, 2.3 * scale, 1.9 * scale, '#597d44');
      add(foliage, x - 0.9 * scale, 4.15 * scale, z + 0.3 * scale, 1.5 * scale, 1.75 * scale, 1.65 * scale, '#70914e');
      add(foliage, x + 0.85 * scale, 4.7 * scale, z - 0.25 * scale, 1.3 * scale, 1.85 * scale, 1.45 * scale, '#638746');
      add(stone, x, 0.12, z, 2.5, 0.18, 2.5, '#b5b8a6');
    };
    for (const x of [-96, -41, -27, 27, 41, 96]) {
      plantTree(x, 228, 0.9);
      plantTree(x, 244.5, 0.86);
    }
    for (const x of [-98, -40, 40, 98]) {
      for (const z of [202, 216, 257, 273]) plantTree(x, z, 0.9);
    }
    for (const x of [-82, -56, -12, 12, 56, 82]) plantTree(x, 276.3, 0.78);
    // Restrained benches, bollards and low planting make the precinct feel inhabited.
    for (const x of [-41, 41]) {
      for (const z of [210, 263]) {
        add(stone, x, 0.36, z, 3.4, 0.6, 0.85, '#adb5a7');
        add(cars, x, 0.73, z, 3.5, 0.15, 0.95, '#a58a64');
        add(cars, x, 1.06, z + 0.42, 3.5, 0.6, 0.12, '#a58a64');
      }
    }
    for (const x of [-10.8, 10.8]) for (const z of [194, 211, 226]) {
      add(metal, x, 0.66, z, 0.18, 1.25, 0.18, '#4f5c56');
      add(lamps, x, 1.3, z, 0.2, 0.12, 0.2, '#eee6cf');
    }
    for (const x of [-94, -41, 41, 94]) for (const z of [229.1, 242.9]) {
      add(metal, x, 2.7, z, 0.14, 5.3, 0.14, '#55615b');
      add(metal, x, 5.4, z, 1.4, 0.12, 0.28, '#55615b');
      add(lamps, x + 0.5, 5.3, z, 0.75, 0.06, 0.3, '#f3e5c8');
    }
    // New outer boundary is low enough to keep the landscaped setting open.
    add(stone, 0, 0.43, 280, 208, 0.8, 0.32, '#bac1b2');
    for (const side of [-1, 1]) add(stone, side * 104, 0.43, 237, 0.32, 0.8, 86, '#bac1b2');
    return { ground, roads, paving, paint, stone, metal, trunks, foliage, flowers, lamps, cars, glazing };
  }, [quality]);

  return (
    <group>
      <Instances geometry={geometry.box} material={materials.matte} items={parts.ground} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.asphalt} items={parts.roads} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.paving} items={parts.paving} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.matte} items={parts.paint} interactive={false} />
      <Instances geometry={geometry.box} material={materials.paving} items={parts.stone} receiveShadow castShadow={quality === 'high'} interactive={false} />
      <Instances geometry={geometry.box} material={materials.metal} items={parts.metal} receiveShadow interactive={false} />
      <Instances geometry={geometry.trunk} material={materials.matte} items={parts.trunks} castShadow={quality === 'high'} interactive={false} />
      <Instances geometry={geometry.crown} material={materials.leaves} items={parts.foliage} receiveShadow castShadow={quality === 'high'} interactive={false} />
      {quality === 'high' && <Instances geometry={geometry.crown} material={materials.leaves} items={parts.flowers} interactive={false} />}
      <Instances geometry={geometry.box} material={materials.lamps} items={parts.lamps} interactive={false} />
      <Instances geometry={geometry.box} material={materials.metal} items={parts.cars} receiveShadow castShadow={quality === 'high'} interactive={false} />
      <Instances geometry={geometry.box} material={materials.glass} items={parts.glazing} interactive={false} />
    </group>
  );
}
