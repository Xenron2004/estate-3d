'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { useExplorerStore } from '@/lib/store';
import { getLabelTexture } from '@/lib/three/assets';
import { hipRoofGeometry, plasterRelief } from './BuiltHomes';
import Instances, { type InstanceDef } from './Instances';

/** An illustrative villa placed to scale, with every element inside its parcel. */
export default function HousePreview() {
  const plot = useExplorerStore((state) => state.plots.find((item) => item.id === state.selectedId));
  const style = useExplorerStore((state) => state.houseStyle);
  const timeOfDay = useExplorerStore((state) => state.timeOfDay);
  const dusk = timeOfDay === 'dusk';
  const labelTexture = useMemo(() => getLabelTexture('Concept only'), []);
  const geometry = useMemo(() => ({
    box: new RoundedBoxGeometry(1, 1, 1, 2, 0.025),
    roof: hipRoofGeometry(),
    sphere: new THREE.SphereGeometry(1, 14, 10),
    trunk: new THREE.CylinderGeometry(0.15, 0.2, 1, 10),
  }), []);
  const relief = useMemo(plasterRelief, []);
  const materials = useMemo(() => ({
    plaster: new THREE.MeshStandardMaterial({ roughness: 0.86, bumpMap: relief, bumpScale: 0.035 }),
    stone: new THREE.MeshStandardMaterial({ roughness: 0.88 }),
    roof: new THREE.MeshStandardMaterial({ roughness: 0.82, side: THREE.DoubleSide }),
    wood: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.5 }),
    glass: new THREE.MeshPhysicalMaterial({ roughness: 0.14, metalness: 0.12, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.2 }),
    interior: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    foliage: new THREE.MeshStandardMaterial({ roughness: 0.94 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffc375' }),
  }), [relief]);
  useEffect(() => {
    materials.interior.emissive.set(dusk ? '#ffbd70' : '#000000');
    materials.interior.emissiveIntensity = dusk ? 0.75 : 0;
    materials.lamp.emissiveIntensity = dusk ? 2.2 : 0.08;
  }, [materials, dusk]);
  useEffect(() => () => {
    Object.values(geometry).forEach((item) => item.dispose());
    Object.values(materials).forEach((item) => item.dispose());
    relief.dispose();
  }, [geometry, materials, relief]);

  const model = useMemo(() => {
    if (!plot || style === 'none') return null;
    const direction = plot.facing === 'south' ? -1 : 1;
    const roadZ = direction < 0 ? plot.minZ : plot.maxZ;
    const width = Math.min(9.1, plot.width - 3.8);
    const depth = Math.min(10.2, plot.depth - 9.8);
    if (width < 4 || depth < 5) return null;
    const frontZ = roadZ - direction * 6.4;
    const centerZ = frontZ - direction * depth / 2;
    const floors = style === 'double' ? 2 : 1;
    const floorHeight = 3.25, base = 0.48, height = floors * floorHeight;
    const roofY = base + height + 0.14, roofH = 1.95;
    const walls: InstanceDef[] = [], stone: InstanceDef[] = [], roofs: InstanceDef[] = [];
    const tiles: InstanceDef[] = [], wood: InstanceDef[] = [], metal: InstanceDef[] = [];
    const glass: InstanceDef[] = [], interiors: InstanceDef[] = [], foliage: InstanceDef[] = [];
    const trunks: InstanceDef[] = [], lamps: InstanceDef[] = [];
    const add = (items: InstanceDef[], x: number, y: number, z: number, w: number, h: number, d: number, color: string) => {
      items.push({ position: [x, y, z], scale: [w, h, d], color });
    };
    add(stone, plot.x, 0.21, plot.z, plot.width - 1.2, 0.12, plot.depth - 1.2, '#8e9f65');
    add(stone, plot.x, 0.35, centerZ, width + 0.4, 0.3, depth + 0.4, '#b1a389');
    add(walls, plot.x, base + height / 2, centerZ, width, height, depth, '#f0e0c5');
    add(stone, plot.x, base + 0.23, centerZ, width + 0.04, 0.46, depth + 0.04, '#c9b490');
    add(stone, plot.x, base + height, centerZ, width + 0.25, 0.18, depth + 0.25, '#f9ecd6');
    if (floors === 2) add(stone, plot.x, base + floorHeight, centerZ, width + 0.16, 0.17, depth + 0.16, '#f4e5cc');
    for (const side of [-1, 1]) {
      for (const end of [-1, 1]) {
        add(stone, plot.x + side * (width / 2 - 0.13), base + height / 2, centerZ + end * (depth / 2 + 0.025), 0.26, height, 0.12, '#d2bc99');
      }
    }
    const roofW = width + 1.2, roofD = depth + 1.2;
    roofs.push({ position: [plot.x, roofY, centerZ], scale: [roofW, roofH, roofD], color: '#ae6043' });
    add(wood, plot.x, roofY - 0.05, centerZ, roofW, 0.15, roofD, '#6c5945');
    add(tiles, plot.x, roofY + roofH + 0.03, centerZ, roofW * 0.57, 0.12, 0.17, '#c78962');
    for (let row = 1; row < 13; row += 1) {
      const t = row / 13;
      for (const side of [-1, 1]) {
        add(tiles, plot.x, roofY + roofH * (1 - t) + 0.025, centerZ + side * roofD * t / 2, roofW * (0.56 + 0.44 * t), 0.045, 0.07, row % 3 ? '#ae6043' : '#c1805e');
      }
    }
    const window = (x: number, y: number, z: number, sideAxis: boolean, outward: number, wide = 1.55) => {
      const piece = (items: InstanceDef[], across: number, up: number, out: number, w: number, h: number, d: number, color: string) => {
        add(items, x + (sideAxis ? outward * out : across), y + up, z + (sideAxis ? across : outward * out), sideAxis ? d : w, h, sideAxis ? w : d, color);
      };
      piece(wood, 0, 0, 0.06, wide + 0.24, 1.75, 0.14, '#46544f');
      piece(interiors, 0, 0, 0.15, wide - 0.04, 1.48, 0.035, dusk ? '#dfb77e' : '#849e98');
      piece(glass, -0.22, 0.04, 0.18, wide * 0.45, 1.34, 0.03, '#93afa9');
      for (const sign of [-1, 1]) {
        piece(stone, sign * (wide / 2 + 0.13), 0, 0.09, 0.12, 1.86, 0.2, '#f8edd9');
        piece(stone, 0, sign * 0.88, 0.12, wide + 0.38, 0.12, 0.28, '#f8edd9');
        piece(wood, sign * wide * 0.33, 0.01, 0.2, wide * 0.17, 1.4, 0.03, '#d6d8c7');
      }
      piece(wood, 0, 0, 0.23, 0.065, 1.52, 0.05, '#46544f');
      piece(wood, 0, 0.2, 0.23, wide, 0.05, 0.05, '#46544f');
      piece(stone, 0, -0.94, 0.16, wide + 0.46, 0.12, 0.42, '#cbb792');
    };
    for (let floor = 0; floor < floors; floor += 1) {
      const y = base + 1.82 + floor * floorHeight;
      for (const side of [-1, 1]) {
        window(plot.x + side * width * 0.29, y, frontZ, false, direction);
        window(plot.x + side * width * 0.25, y, centerZ - direction * depth / 2, false, -direction);
        window(plot.x + side * width / 2, y, centerZ - depth * 0.23, true, side, 1.65);
        window(plot.x + side * width / 2, y, centerZ + depth * 0.23, true, side, 1.65);
      }
    }
    add(wood, plot.x, 1.75, frontZ + direction * 0.1, 1.55, 2.55, 0.2, '#4d4d40');
    add(wood, plot.x, 1.74, frontZ + direction * 0.23, 1.25, 2.35, 0.08, '#7e573b');
    add(metal, plot.x + 0.43, 1.74, frontZ + direction * 0.29, 0.07, 0.36, 0.06, '#d4b676');
    for (const side of [-1, 1]) {
      add(stone, plot.x + side * 0.85, 1.76, frontZ + direction * 0.12, 0.14, 2.64, 0.26, '#f5e7cf');
      add(metal, plot.x + side * 1.25, 2.45, frontZ + direction * 0.24, 0.22, 0.42, 0.22, '#43534a');
      add(lamps, plot.x + side * 1.25, 2.45, frontZ + direction * 0.36, 0.13, 0.27, 0.12, '#fff0d0');
    }
    add(stone, plot.x, 3.1, frontZ + direction * 0.12, 1.84, 0.15, 0.28, '#f5e7cf');
    const porchZ = frontZ + direction * 1.25, porchW = width * 0.8;
    add(stone, plot.x, 0.4, porchZ, porchW, 0.3, 2.9, '#baa98e');
    add(stone, plot.x, 0.58, porchZ, porchW + 0.1, 0.1, 3.0, '#e1d4b9');
    add(stone, plot.x, 3.5, porchZ, porchW + 0.3, 0.24, 3.05, '#eee0c6');
    for (const side of [-1, 1]) {
      add(stone, plot.x + side * (porchW / 2 - 0.3), 1.98, frontZ + direction * 2.3, 0.25, 2.9, 0.25, '#f5e7cf');
      add(stone, plot.x + side * (porchW / 2 - 0.3), 0.86, frontZ + direction * 2.3, 0.42, 0.45, 0.42, '#c7b18e');
    }
    if (floors === 2) {
      add(wood, plot.x, 4.84, frontZ + direction * 0.1, 1.6, 2.3, 0.16, '#4b5851');
      add(interiors, plot.x, 4.84, frontZ + direction * 0.2, 1.35, 2.04, 0.05, dusk ? '#dfb77e' : '#8da397');
      add(wood, plot.x, 4.84, frontZ + direction * 0.26, 0.08, 2.04, 0.05, '#efe2c9');
      add(metal, plot.x, 4.58, frontZ + direction * 2.68, porchW, 0.09, 0.1, '#53615a');
      add(metal, plot.x, 3.8, frontZ + direction * 2.68, porchW, 0.07, 0.08, '#53615a');
      for (let rail = 0; rail < 13; rail += 1) {
        add(metal, plot.x - porchW / 2 + rail * porchW / 12, 4.18, frontZ + direction * 2.68, 0.06, 0.82, 0.06, '#53615a');
      }
      for (const side of [-1, 1]) {
        add(metal, plot.x + side * porchW / 2, 4.58, porchZ, 0.1, 0.09, 2.8, '#53615a');
        for (let rail = 0; rail < 5; rail += 1) {
          add(metal, plot.x + side * porchW / 2, 4.18, frontZ + direction * (0.2 + rail * 0.55), 0.06, 0.82, 0.06, '#53615a');
        }
        add(stone, plot.x + side * 2.4, 3.86, frontZ + direction * 2.2, 1.1, 0.46, 0.52, '#b48260');
        add(foliage, plot.x + side * 2.4, 4.12, frontZ + direction * 2.2, 0.6, 0.25, 0.34, '#6d874b');
      }
    } else roofs.push({ position: [plot.x, 3.64, porchZ], scale: [porchW + 0.75, 0.9, 3.4], color: '#ae6043' });
    for (let step = 0; step < 3; step += 1) {
      add(stone, plot.x, 0.44 - step * 0.1, frontZ + direction * (2.95 + step * 0.32), 2.6 + step * 0.14, 0.12, 0.4, '#d5c5a9');
    }
    // Both endpoints are world coordinates; no facing sign is applied to roadZ.
    const pathEnd = frontZ + direction * 3.76;
    const pathLength = Math.abs(pathEnd - roadZ);
    add(stone, plot.x, 0.3, (pathEnd + roadZ) / 2, 2.9, 0.07, pathLength, '#c7c0ad');
    for (let paver = 0; paver < Math.floor(pathLength / 0.6); paver += 1) {
      add(stone, plot.x, 0.34, roadZ - direction * (0.3 + paver * 0.6), 2.8, 0.015, 0.03, '#a4a08e');
    }
    for (const side of [-1, 1]) {
      const gardenX = plot.x + side * (plot.width / 2 - 2.1), gardenZ = roadZ - direction * 2.4;
      add(stone, gardenX, 0.42, roadZ - direction * 0.95, 2.8, 0.28, 0.6, '#b2946e');
      for (let shrub = 0; shrub < 4; shrub += 1) {
        add(foliage, gardenX - 1.02 + shrub * 0.68, 0.72, roadZ - direction * 0.95, 0.43, 0.44, 0.36, shrub % 2 ? '#678449' : '#7d9656');
      }
      trunks.push({ position: [gardenX, 1.3, gardenZ], scale: [1, 2.1, 1], color: '#84654b' });
      add(foliage, gardenX, 3.05, gardenZ, 0.95, 1.15, 0.95, '#718d4c');
      add(foliage, gardenX + 0.35, 2.76, gardenZ + 0.2, 0.65, 0.72, 0.65, '#87a45d');
      add(stone, plot.x + side * 1.7, 0.82, frontZ + direction * 2.1, 0.52, 0.62, 0.52, '#b57e58');
      add(foliage, plot.x + side * 1.7, 1.26, frontZ + direction * 2.1, 0.48, 0.48, 0.48, '#70884a');
    }
    return { walls, stone, roofs, tiles, wood, metal, glass, interiors, foliage, trunks, lamps, labelPosition: [plot.x, roofY + roofH + 1.25, centerZ] as [number, number, number] };
  }, [plot, style, dusk]);

  if (!model) return null;
  return (
    <group name="concept-villa-preview">
      <Instances geometry={geometry.box} material={materials.plaster} items={model.walls} castShadow receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.stone} items={model.stone} castShadow receiveShadow interactive={false} />
      <Instances geometry={geometry.roof} material={materials.roof} items={model.roofs} castShadow receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.roof} items={model.tiles} receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.wood} items={model.wood} castShadow receiveShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.metal} items={model.metal} interactive={false} />
      <Instances geometry={geometry.box} material={materials.interior} items={model.interiors} interactive={false} />
      <Instances geometry={geometry.box} material={materials.glass} items={model.glass} interactive={false} />
      <Instances geometry={geometry.sphere} material={materials.foliage} items={model.foliage} castShadow receiveShadow interactive={false} />
      <Instances geometry={geometry.trunk} material={materials.wood} items={model.trunks} castShadow interactive={false} />
      <Instances geometry={geometry.box} material={materials.lamp} items={model.lamps} interactive={false} />
      <sprite position={model.labelPosition} scale={[5.4, 2.03, 1]}>
        <spriteMaterial map={labelTexture} transparent depthTest={false} depthWrite={false} />
      </sprite>
    </group>
  );
}
