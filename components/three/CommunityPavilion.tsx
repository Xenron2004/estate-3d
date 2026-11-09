'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { useExplorerStore } from '@/lib/store';
import Instances, { type InstanceDef } from './Instances';

/** A small garden cafe on the western park lawn, outside every residential parcel. */
export default function CommunityPavilion({ quality = 'high' }: { quality?: 'high' | 'low' }) {
  const dusk = useExplorerStore((state) => state.timeOfDay === 'dusk');
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const roundedBox = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.025), []);
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 12, 10), []);
  const cylinder = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 16), []);
  const gable = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([-6, 0, 0, 6, 0, 0, 0, 1.96, 0], 3));
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  const parts = useMemo(() => {
    const masonry: InstanceDef[] = [];
    const timber: InstanceDef[] = [];
    const roof: InstanceDef[] = [];
    const glass: InstanceDef[] = [];
    const metal: InstanceDef[] = [];
    const leaves: InstanceDef[] = [];
    const flowers: InstanceDef[] = [];
    const tables: InstanceDef[] = [];
    const lamps: InstanceDef[] = [];
    const add = (items: InstanceDef[], position: InstanceDef['position'], scale: InstanceDef['scale'], color: string, rotation?: InstanceDef['rotation']) => items.push({ position, scale, color, rotation });

    // Raised stone plinth, terrace, steps and a short path to the park's east loop.
    add(masonry, [0, 0.24, 0], [17.6, 0.45, 12.6], '#c3b496');
    add(masonry, [0, 0.12, -8.7], [20, 0.22, 5.4], '#d1c4a8');
    add(masonry, [0, 0.12, -6.6], [4, 0.2, 0.5], '#c1b398');
    add(masonry, [10.6, 0.1, -9.2], [2, 0.16, 4.6], '#cbbfa3');
    // Individually laid terrace joints catch grazing light.
    for (let i = -9; i <= 9; i += 1) add(masonry, [i, 0.24, -8.8], [0.018, 0.012, 5.1], '#b2a58b');
    for (const z of [-10.5, -9, -7.5]) add(masonry, [0, 0.24, z], [19.8, 0.012, 0.018], '#b2a58b');

    for (const side of [-1, 1]) {
      // Solid low walls and four corner piers anchor the glazed volume.
      add(masonry, [0, 0.7, side * 6], [17, 0.8, 0.32], '#e2d8c1');
      add(masonry, [side * 8.5, 0.7, 0], [0.32, 0.8, 12], '#e2d8c1');
      add(timber, [0, 4.17, side * 6], [17.4, 0.24, 0.26], '#8d6745');
      add(timber, [side * 8.5, 4.17, 0], [0.26, 0.24, 12.4], '#8d6745');
      for (const x of [-8.3, 8.3]) add(masonry, [x, 2.3, side * 5.85], [0.65, 3.75, 0.68], '#ded2ba');

      for (let bay = -3; bay <= 3; bay += 1) {
        const x = bay * 2.35;
        add(glass, [x, 2.58, side * 6.035], [2.19, 2.93, 0.065], '#9cbeb2');
        add(timber, [x - 1.16, 2.6, side * 6.09], [0.13, 3.15, 0.16], '#7e6148');
        add(timber, [x, 3.32, side * 6.1], [2.22, 0.08, 0.15], '#8f7051');
      }
      for (let bay = -2; bay <= 2; bay += 1) {
        const z = bay * 2.23;
        add(glass, [side * 8.535, 2.58, z], [0.065, 2.93, 2.08], '#91b4aa');
        add(timber, [side * 8.59, 2.6, z - 1.1], [0.16, 3.15, 0.13], '#7e6148');
        add(timber, [side * 8.6, 3.32, z], [0.15, 0.08, 2.12], '#8f7051');
      }
    }
    // A double door and visible handles distinguish the entrance from the window bays.
    add(timber, [0, 2.1, -6.14], [0.1, 3.55, 0.18], '#624f3b');
    for (const x of [-0.23, 0.23]) add(metal, [x, 2.03, -6.27], [0.045, 0.57, 0.07], '#b9ab7f');

    const pitch = Math.atan2(2.1, 6.4);
    const slope = Math.hypot(2.1, 6.4);
    for (const side of [-1, 1]) {
      add(roof, [0, 5.24, side * 3.2], [18.6, 0.2, slope + 0.25], '#697e70', [side * pitch, 0, 0]);
      add(metal, [0, 4.13, side * 6.55], [18.8, 0.15, 0.15], '#596958');
      // Standing seams, raised slightly above the pitched roof skin.
      for (let x = -8.8; x < 9; x += 0.8) add(roof, [x, 5.37, side * 3.2], [0.055, 0.075, slope + 0.25], '#7c8c7a', [side * pitch, 0, 0]);
      for (const x of [-4, 4]) {
        add(metal, [x, 5.56, side * 2.7], [3.3, 0.12, 3.1], '#556957', [side * pitch, 0, 0]);
        add(glass, [x, 5.65, side * 2.7], [2.96, 0.07, 2.8], '#a9c7b8', [side * pitch, 0, 0]);
      }
    }
    add(roof, [0, 6.37, 0], [18.85, 0.18, 0.3], '#81907a');
    for (const x of [-8.55, 8.55]) {
      add(timber, [x, 5.15, -3], [0.17, 0.2, 6.5], '#9c7751', [-pitch, 0, 0]);
      add(timber, [x, 5.15, 3], [0.17, 0.2, 6.5], '#9c7751', [pitch, 0, 0]);
      add(timber, [x, 5.15, 0], [0.18, 2.0, 0.16], '#90704d');
      add(metal, [x, 2.1, 6.35], [0.11, 4.1, 0.11], '#657563');
    }
    // Timber pergola over the western terrace, with a planted end screen.
    for (const x of [-8.5, -2]) for (const z of [-6.9, -10.7]) add(timber, [x, 1.85, z], [0.16, 3.55, 0.16], '#98744e');
    for (const x of [-8.5, -2]) add(timber, [x, 3.65, -8.8], [0.2, 0.2, 4.3], '#9d7951');
    for (let x = -8.7; x <= -1.7; x += 0.5) add(timber, [x, 3.8, -8.8], [0.16, 0.18, 4.6], '#ad8758');

    // Tables and chairs inside the conservatory and under the terrace pergola.
    for (const [x, z] of [[-5, -1.4], [0, -1.4], [5, -1.4], [-5, 3], [0, 3], [5, 3], [-6.5, -8.6], [-3.3, -8.6], [4.9, -8.6]]) {
      add(tables, [x, 1.03, z], [0.76, 0.1, 0.76], '#b39161');
      add(metal, [x, 0.59, z], [0.1, 0.85, 0.1], '#526555');
      add(metal, [x, 0.27, z], [0.65, 0.08, 0.48], '#526555');
      for (const side of [-1, 1]) {
        add(timber, [x + side * 1.08, 0.66, z], [0.57, 0.1, 0.62], '#ab8054');
        add(timber, [x + side * 1.34, 1.0, z], [0.1, 0.64, 0.62], '#ab8054');
        for (const dz of [-0.22, 0.22]) add(metal, [x + side * 1.08, 0.41, z + dz], [0.06, 0.5, 0.06], '#586651');
      }
    }
    // A service counter, shelving, and hanging lights give the transparent facade depth.
    add(timber, [0, 0.91, 5.04], [7.8, 1.1, 1.15], '#997650');
    add(masonry, [0, 1.51, 5.04], [8, 0.14, 1.3], '#e2d7bf');
    for (const x of [-4.4, 4.4]) add(timber, [x, 2.03, 5.57], [0.12, 3.1, 0.3], '#8a6c4a');
    for (const y of [1.95, 2.75, 3.5]) add(timber, [0, y, 5.55], [8.8, 0.1, 0.6], '#ac8a5d');
    for (const x of [-5, 0, 5]) {
      add(metal, [x, 3.83, -0.8], [0.035, 0.7, 0.035], '#526052');
      add(lamps, [x, 3.38, -0.8], [0.23, 0.2, 0.23], '#ffe3ad');
    }
    for (const [x, z] of [[-9.1, -9], [9.1, -9], [-9, 4.6], [9, 4.6], [2, -10.7], [7.7, -10.7]]) {
      add(timber, [x, 0.55, z], [0.95, 0.9, 0.95], '#ae7d56');
      add(leaves, [x, 1.25, z], [0.8, 0.85, 0.76], '#648052');
      add(leaves, [x - 0.25, 1.65, z + 0.1], [0.5, 0.55, 0.5], '#7b985e');
      for (const offset of [-0.35, 0, 0.35]) add(flowers, [x + offset, 1.7, z - 0.2], [0.13, 0.17, 0.13], '#cda1af');
    }
    // Low address board beneath the pergola reads as architectural signage without a network font.
    add(timber, [5.4, 3.55, -6.3], [3.5, 0.58, 0.13], '#566d57');
    return { masonry, timber, roof, glass, metal, leaves, flowers, tables, lamps };
  }, []);
  const materials = useMemo(() => ({
    stone: new THREE.MeshStandardMaterial({ roughness: 0.88 }),
    timber: new THREE.MeshStandardMaterial({ roughness: 0.74 }),
    roof: new THREE.MeshStandardMaterial({ roughness: 0.56, metalness: 0.28 }),
    glass: new THREE.MeshPhysicalMaterial({ roughness: 0.14, metalness: 0.1, clearcoat: 1, transparent: true, opacity: 0.46, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.4 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.48 }),
    leaves: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
    lamps: new THREE.MeshStandardMaterial({ color: '#ffdfab', emissive: '#ffb85a', emissiveIntensity: 0.18, roughness: 0.5 }),
  }), []);
  useEffect(() => {
    materials.lamps.emissiveIntensity = dusk ? 2.4 : 0.18;
  }, [dusk, materials]);
  useEffect(() => () => {
    Object.values(materials).forEach((material) => material.dispose());
    box.dispose();
    roundedBox.dispose();
    sphere.dispose();
    cylinder.dispose();
    gable.dispose();
  }, [materials, box, roundedBox, sphere, cylinder, gable]);
  const shadows = quality === 'high';
  return (
    <group position={[-22, 0, 168]}>
      <Instances geometry={roundedBox} material={materials.stone} items={parts.masonry} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={box} material={materials.timber} items={parts.timber} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={box} material={materials.roof} items={parts.roof} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={box} material={materials.metal} items={parts.metal} receiveShadow interactive={false} />
      <Instances geometry={cylinder} material={materials.timber} items={parts.tables} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={sphere} material={materials.leaves} items={parts.leaves} castShadow={shadows} receiveShadow interactive={false} />
      <Instances geometry={sphere} material={materials.leaves} items={parts.flowers} interactive={false} />
      <Instances geometry={sphere} material={materials.lamps} items={parts.lamps} interactive={false} />
      <Instances geometry={box} material={materials.glass} items={parts.glass} interactive={false} />
      {[-8.52, 8.52].map((x) => <mesh key={x} geometry={gable} position={[x, 4.2, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.glass} raycast={() => {}} />)}
      {dusk && quality === 'high' && <pointLight position={[0, 2.7, 0]} color="#ffd49a" intensity={18} distance={19} decay={2} />}
    </group>
  );
}
