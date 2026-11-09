'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PLOTS } from '@/lib/data/township';
import { useExplorerStore } from '@/lib/store';
import Instances, { type InstanceDef } from './Instances';

const BUILT_PLOTS = PLOTS.filter((plot) => plot.status === 'sold' && plot.id !== 'B-14');
const PALETTES = [
  { wall: '#f1dfbf', accent: '#c4ae8a', roof: '#ac5940', wood: '#75533c' },
  { wall: '#e4e6d7', accent: '#a9b29d', roof: '#9b5d45', wood: '#6b5140' },
  { wall: '#eed6c0', accent: '#d0aa8a', roof: '#a74f39', wood: '#7a5237' },
  { wall: '#e5e0cc', accent: '#b5b29c', roof: '#806756', wood: '#60513d' },
  { wall: '#f1e6cf', accent: '#c2b392', roof: '#b56947', wood: '#78583d' },
];

/** A closed hipped roof; width, height and depth are scaled per villa. */
export function hipRoofGeometry() {
  const geometry = new THREE.BufferGeometry();
  const a = [-0.5, 0, -0.5], b = [0.5, 0, -0.5];
  const c = [0.5, 0, 0.5], d = [-0.5, 0, 0.5];
  const left = [-0.28, 1, 0], right = [0.28, 1, 0];
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    ...a, ...left, ...b, ...b, ...left, ...right,
    ...b, ...right, ...c,
    ...c, ...right, ...d, ...d, ...right, ...left,
    ...d, ...left, ...a,
    ...a, ...b, ...d, ...b, ...c, ...d,
  ], 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** Procedural plaster relief needs no downloads and stays crisp at street level. */
export function plasterRelief() {
  const pixels = new Uint8Array(64 * 64 * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    const noise = Math.sin(i * 12.9898) * 43758.5453;
    const value = 135 + Math.floor((noise - Math.floor(noise)) * 76);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
    pixels[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(pixels, 64, 64);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(7, 5);
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export default function BuiltHomes({ quality = 'high' }: { quality?: 'high' | 'low' }) {
  const timeOfDay = useExplorerStore((state) => state.timeOfDay);
  const dusk = timeOfDay === 'dusk';
  const detailed = quality === 'high';
  const geometry = useMemo(() => ({
    box: new RoundedBoxGeometry(1, 1, 1, 2, 0.025),
    roof: hipRoofGeometry(),
    foliage: new THREE.SphereGeometry(1, 12, 8),
    cap: new THREE.CylinderGeometry(0.075, 0.075, 1, 8),
  }), []);
  const relief = useMemo(plasterRelief, []);
  const materials = useMemo(() => ({
    plaster: new THREE.MeshStandardMaterial({ roughness: 0.86, bumpMap: relief, bumpScale: 0.035 }),
    stone: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
    roof: new THREE.MeshStandardMaterial({ roughness: 0.82, side: THREE.DoubleSide }),
    wood: new THREE.MeshStandardMaterial({ roughness: 0.72 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.6 }),
    glass: new THREE.MeshStandardMaterial({ roughness: 0.16, metalness: 0.32, envMapIntensity: 1.2 }),
    interior: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    foliage: new THREE.MeshStandardMaterial({ roughness: 0.94 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffc375' }),
  }), [relief]);

  useEffect(() => {
    materials.interior.emissive.set(dusk ? '#ffbd70' : '#261d13');
    materials.interior.emissiveIntensity = dusk ? 0.65 : 0;
    materials.lamp.emissiveIntensity = dusk ? 2.2 : timeOfDay === 'golden' ? 0.25 : 0;
  }, [materials, dusk, timeOfDay]);

  useEffect(() => () => {
    Object.values(geometry).forEach((item) => item.dispose());
    Object.values(materials).forEach((item) => item.dispose());
    relief.dispose();
  }, [geometry, materials, relief]);

  const parts = useMemo(() => {
    const walls: InstanceDef[] = [], stone: InstanceDef[] = [], roofs: InstanceDef[] = [];
    const tiles: InstanceDef[] = [], wood: InstanceDef[] = [], metal: InstanceDef[] = [];
    const glass: InstanceDef[] = [], interiors: InstanceDef[] = [], leaves: InstanceDef[] = [];
    const blooms: InstanceDef[] = [], lamps: InstanceDef[] = [], caps: InstanceDef[] = [];

    BUILT_PLOTS.forEach((plot, index) => {
      const palette = PALETTES[index % PALETTES.length];
      const width = Math.min(9.1, plot.width - 3.8);
      const depth = index === 1 ? 10.2 : 9.2;
      const floors = index % 2 === 0 ? 2 : 1;
      const floorHeight = 3.25;
      const height = floors * floorHeight;
      const direction = plot.facing === 'south' ? -1 : 1;
      const roadZ = direction < 0 ? plot.minZ : plot.maxZ;
      // The veranda and garden face the road, with a usable rear setback.
      const centerZ = roadZ - direction * (7 + depth / 2);
      const frontZ = centerZ + direction * depth / 2;
      const porchZ = frontZ + direction * 1.1;
      const base = 0.45;
      const add = (items: InstanceDef[], x: number, y: number, z: number, w: number, h: number, d: number, color: string) => {
        items.push({ position: [x, y, z], scale: [w, h, d], color });
      };

      add(walls, plot.x, base + height / 2, centerZ, width, height, depth, palette.wall);
      add(stone, plot.x, 0.3, centerZ, width + 0.4, 0.4, depth + 0.4, '#a6977e');
      add(stone, plot.x, base + 0.25, centerZ, width + 0.06, 0.5, depth + 0.06, palette.accent);
      add(stone, plot.x, base + height, centerZ, width + 0.28, 0.2, depth + 0.28, '#f8ecd5');
      if (floors === 2) add(stone, plot.x, base + floorHeight, centerZ, width + 0.18, 0.18, depth + 0.18, '#f2e4cd');
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          add(stone, plot.x + sx * (width / 2 - 0.13), base + height / 2, centerZ + sz * (depth / 2 + 0.025), 0.28, height, 0.12, palette.accent);
        }
      }

      const roofW = width + 1.3, roofD = depth + 1.3;
      const roofY = base + height + 0.15, roofH = floors === 2 ? 2.15 : 1.85;
      roofs.push({ position: [plot.x, roofY, centerZ], scale: [roofW, roofH, roofD], color: palette.roof });
      add(wood, plot.x, roofY - 0.06, centerZ, roofW, 0.16, roofD, '#625343');
      caps.push({ position: [plot.x, roofY + roofH + 0.015, centerZ], scale: [1.5, roofW * 0.57, 1.5], rotation: [0, 0, Math.PI / 2], color: '#bf805e' });
      const rows = detailed ? 13 : 6;
      for (let row = 1; row < rows; row += 1) {
        const t = row / rows;
        for (const side of [-1, 1]) {
          add(tiles, plot.x, roofY + roofH * (1 - t) + 0.025, centerZ + side * roofD * t / 2, roofW * (0.56 + 0.44 * t), 0.045, 0.07, row % 3 === 0 ? '#c1805e' : palette.roof);
        }
      }

      // Frames, deep reveals and curtains are separate from reflective glass.
      const window = (x: number, y: number, z: number, sideAxis: boolean, outward: number, wide = 1.55) => {
        const orient = (items: InstanceDef[], across: number, up: number, out: number, w: number, h: number, d: number, color: string) => {
          add(items, x + (sideAxis ? outward * out : across), y + up, z + (sideAxis ? across : outward * out), sideAxis ? d : w, h, sideAxis ? w : d, color);
        };
        orient(wood, 0, 0, 0.065, wide + 0.26, 1.75, 0.16, '#4b544f');
        orient(interiors, 0, 0, 0.155, wide - 0.07, 1.48, 0.035, dusk ? '#d4a96f' : '#7d9290');
        orient(glass, -wide * 0.19, 0.06, 0.18, wide * 0.48, 1.35, 0.02, '#91aba8');
        for (const sign of [-1, 1]) {
          orient(stone, sign * (wide / 2 + 0.15), 0, 0.08, 0.12, 1.87, 0.18, '#f8edda');
          orient(stone, 0, sign * 0.88, 0.1, wide + 0.42, 0.12, 0.26, '#f8edda');
          orient(wood, sign * wide * 0.32, 0.02, 0.2, wide * 0.19, 1.42, 0.04, dusk ? '#ead4aa' : '#bec8bc');
        }
        orient(wood, 0, 0, 0.235, 0.065, 1.52, 0.05, '#4b544f');
        orient(wood, 0, 0.2, 0.235, wide, 0.055, 0.05, '#4b544f');
        orient(stone, 0, -0.92, 0.15, wide + 0.5, 0.12, 0.46, palette.accent);
      };
      for (let floor = 0; floor < floors; floor += 1) {
        const y = base + 1.83 + floor * floorHeight;
        for (const side of [-1, 1]) {
          window(plot.x + side * 2.7, y, frontZ, false, direction);
          window(plot.x + side * 2.4, y, centerZ - direction * depth / 2, false, -direction);
          window(plot.x + side * width / 2, y, centerZ - 1.8, true, side, 1.7);
          window(plot.x + side * width / 2, y, centerZ + 2.3, true, side, 1.4);
        }
      }

      add(wood, plot.x, 1.72, frontZ + direction * 0.12, 1.55, 2.55, 0.2, '#4b493e');
      add(wood, plot.x, 1.7, frontZ + direction * 0.25, 1.25, 2.35, 0.08, palette.wood);
      for (const side of [-1, 1]) {
        add(wood, plot.x + side * 0.4, 1.72, frontZ + direction * 0.3, 0.04, 2.15, 0.035, '#a88760');
        add(stone, plot.x + side * 0.86, 1.74, frontZ + direction * 0.15, 0.14, 2.65, 0.26, '#f8edda');
        add(metal, plot.x + side * 1.28, 2.45, frontZ + direction * 0.23, 0.22, 0.42, 0.22, '#40473e');
        add(lamps, plot.x + side * 1.28, 2.45, frontZ + direction * 0.36, 0.14, 0.27, 0.12, '#fff0ce');
      }
      add(metal, plot.x + 0.42, 1.72, frontZ + direction * 0.34, 0.065, 0.38, 0.065, '#d8b878');
      add(stone, plot.x, 3.08, frontZ + direction * 0.12, 1.9, 0.15, 0.3, '#f8edda');

      const porchW = width * 0.83;
      add(stone, plot.x, 0.32, porchZ, porchW, 0.42, 2.7, '#b3a38a');
      add(stone, plot.x, 0.55, porchZ, porchW + 0.1, 0.12, 2.8, '#e2d4ba');
      for (const side of [-1, 1]) {
        add(stone, plot.x + side * (porchW / 2 - 0.35), 1.94, frontZ + direction * 2.03, 0.25, 2.9, 0.25, '#f4e7ce');
        add(stone, plot.x + side * (porchW / 2 - 0.35), 0.79, frontZ + direction * 2.03, 0.44, 0.45, 0.44, palette.accent);
      }
      add(stone, plot.x, 3.45, porchZ, porchW + 0.35, 0.25, 2.95, '#efe1c7');
      if (floors === 2) {
        const balconyY = 3.59;
        add(wood, plot.x, 4.78, frontZ + direction * 0.11, 1.65, 2.3, 0.14, '#46534e');
        add(interiors, plot.x, 4.78, frontZ + direction * 0.2, 1.38, 2.05, 0.06, dusk ? '#d4a96f' : '#849b95');
        add(wood, plot.x, 4.78, frontZ + direction * 0.26, 0.08, 2.1, 0.05, '#f0e2c8');
        add(metal, plot.x, balconyY + 0.95, frontZ + direction * 2.42, porchW, 0.09, 0.1, '#53615a');
        add(metal, plot.x, balconyY + 0.15, frontZ + direction * 2.42, porchW, 0.07, 0.08, '#53615a');
        for (let n = 0; n < 12; n += 1) {
          add(metal, plot.x - porchW / 2 + n * porchW / 11, balconyY + 0.54, frontZ + direction * 2.42, 0.06, 0.82, 0.06, '#53615a');
        }
        for (const side of [-1, 1]) {
          add(metal, plot.x + side * porchW / 2, balconyY + 0.95, porchZ, 0.1, 0.09, 2.65, '#53615a');
          for (let n = 0; n < 5; n += 1) {
            add(metal, plot.x + side * porchW / 2, balconyY + 0.54, frontZ + direction * (0.15 + n * 0.54), 0.06, 0.82, 0.06, '#53615a');
          }
          add(stone, plot.x + side * 2.5, balconyY + 0.23, frontZ + direction * 1.92, 1.25, 0.45, 0.52, '#b48260');
          add(leaves, plot.x + side * 2.5, balconyY + 0.49, frontZ + direction * 1.92, 0.65, 0.23, 0.35, '#698348');
        }
      } else {
        roofs.push({ position: [plot.x, 3.61, porchZ], scale: [porchW + 0.8, 0.9, 3.4], color: palette.roof });
      }

      const stepFront = frontZ + direction * 2.72;
      for (let step = 0; step < 3; step += 1) {
        add(stone, plot.x, 0.4 - step * 0.11, stepFront + direction * step * 0.34, 2.55 + step * 0.14, 0.12, 0.42, '#d3c4a8');
      }
      const pathStart = stepFront + direction * 0.85;
      const pathLength = Math.abs(pathStart - roadZ);
      add(stone, plot.x, 0.155, (pathStart + roadZ) / 2, 2.8, 0.12, pathLength, '#bdb9a8');
      if (detailed) {
        for (let paver = 0; paver < Math.floor(pathLength / 0.65); paver += 1) {
          add(stone, plot.x, 0.222, roadZ - direction * (0.32 + paver * 0.65), 2.72, 0.012, 0.025, '#9d9c8b');
        }
      }

      // Front gardens make each house read as a lived-in property.
      for (const side of [-1, 1]) {
        const gardenX = plot.x + side * 3.9;
        const gardenZ = roadZ - direction * 2.45;
        add(stone, gardenX, 0.16, gardenZ, 3.1, 0.08, 3.7, '#829457');
        add(stone, gardenX, 0.25, roadZ - direction * 4.2, 3.1, 0.26, 0.4, '#b7a488');
        add(stone, gardenX, 0.29, roadZ - direction * 0.8, 3.1, 0.3, 0.56, '#aa8a68');
        for (let plant = 0; plant < 4; plant += 1) {
          const px = gardenX - 1.13 + plant * 0.75;
          add(leaves, px, 0.56, roadZ - direction * 0.8, 0.48, 0.48, 0.42, plant % 2 ? '#557644' : '#6d8b4b');
          if (detailed) add(blooms, px + 0.12, 0.91, roadZ - direction * 0.8, 0.17, 0.12, 0.15, index % 2 ? '#d9b458' : '#d18d80');
        }
        add(leaves, plot.x + side * (width / 2 + 0.62), 0.64, centerZ, 0.42, 0.6, depth / 2, '#597447');
        add(stone, plot.x + side * 1.74, 0.6, frontZ + direction * 1.9, 0.5, 0.62, 0.5, '#b57c55');
        add(leaves, plot.x + side * 1.74, 1.1, frontZ + direction * 1.9, 0.52, 0.55, 0.52, '#6f8c4c');
      }
      if (detailed) {
        // Rainwater pipes and a compact chimney reward a closer look.
        for (const side of [-1, 1]) {
          add(metal, plot.x + side * (width / 2 + 0.08), base + height / 2, centerZ - direction * (depth / 2 - 0.22), 0.1, height, 0.1, '#8e8c77');
        }
        add(stone, plot.x + 2.4, roofY + 1.15, centerZ - 1.4, 0.85, 2.15, 0.85, '#b4987a');
        add(stone, plot.x + 2.4, roofY + 2.25, centerZ - 1.4, 1.02, 0.18, 1.02, '#776c5c');
      }
    });
    return { walls, stone, roofs, tiles, wood, metal, glass, interiors, leaves, blooms, lamps, caps };
  }, [detailed, dusk]);

  return (
    <group name="residential-villas">
      <Instances geometry={geometry.box} material={materials.plaster} items={parts.walls} castShadow={detailed} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.stone} items={parts.stone} castShadow={detailed} receiveShadow interactive={false} />
      <Instances geometry={geometry.roof} material={materials.roof} items={parts.roofs} castShadow={detailed} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.roof} items={parts.tiles} receiveShadow interactive={false} />
      <Instances geometry={geometry.cap} material={materials.roof} items={parts.caps} interactive={false} />
      <Instances geometry={geometry.box} material={materials.wood} items={parts.wood} castShadow={detailed} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.metal} items={parts.metal} interactive={false} />
      <Instances geometry={geometry.box} material={materials.interior} items={parts.interiors} interactive={false} />
      <Instances geometry={geometry.box} material={materials.glass} items={parts.glass} interactive={false} />
      <Instances geometry={geometry.foliage} material={materials.foliage} items={parts.leaves} castShadow={detailed} receiveShadow interactive={false} />
      <Instances geometry={geometry.foliage} material={materials.foliage} items={parts.blooms} interactive={false} />
      <Instances geometry={geometry.box} material={materials.lamp} items={parts.lamps} interactive={false} />
    </group>
  );
}
