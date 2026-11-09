'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import Instances, { type InstanceDef } from './Instances';
import { mulberry32 } from '@/lib/three/assets';
import { GREEN, PLOTS, ROADS, SITE } from '@/lib/data/township';
import { createParkTrail } from '@/lib/three/park-trail';
import { DISTRICT_BOUNDS } from '@/lib/data/apartment-district';

const PARK_WALK_CLEARANCE = createParkTrail(0).getPoints(160);

interface TreeSpot {
  x: number;
  z: number;
  scale: number;
  tone: string;
}

function clearOfRoads(x: number, z: number, clearance = 3.4): boolean {
  return Object.values(ROADS).every((road) => {
    const along = road.axis === 'x' ? x : z;
    const across = road.axis === 'x' ? z : x;
    return along < road.from - clearance || along > road.to + clearance ||
      Math.abs(across - road.center) > road.width / 2 + clearance;
  });
}

function clearOfArchitecture(x: number, z: number): boolean {
  if (x > DISTRICT_BOUNDS.minX - 5 && x < DISTRICT_BOUNDS.maxX + 5 && z > 183 && z < DISTRICT_BOUNDS.maxZ + 5) return false;
  if (PLOTS.some((plot) => x > plot.minX - 1 && x < plot.maxX + 1 && z > plot.minZ - 1 && z < plot.maxZ + 1)) return false;
  if (x > -34 && x < -10 && z > 154.8 && z < 178) return false;
  if (Math.hypot(x, z - 150) < 11) return false;
  if (PARK_WALK_CLEARANCE.some((point) => Math.hypot(x - point.x, z - point.z) < 2.6)) return false;
  if (x > -27 && x < 27 && z > 24 && z < 65) return false;
  if (x > -28 && x < 28 && z > 74 && z < 114) return false;
  return true;
}

function branchBetween(from: THREE.Vector3, to: THREE.Vector3, radius: number, color: string): InstanceDef {
  const direction = to.clone().sub(from);
  const rotation = new THREE.Euler().setFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()),
  );
  return {
    position: from.clone().add(to).multiplyScalar(0.5).toArray() as [number, number, number],
    rotation: [rotation.x, rotation.y, rotation.z],
    scale: [radius, direction.length(), radius],
    color,
  };
}

/** An asymmetric leaf mass catches light without a perfectly spherical silhouette. */
function createCrownGeometry() {
  const geometry = new THREE.SphereGeometry(1, 16, 12);
  const vertices = geometry.attributes.position;
  for (let i = 0; i < vertices.count; i += 1) {
    const x = vertices.getX(i);
    const y = vertices.getY(i);
    const z = vertices.getZ(i);
    const r = 1 + Math.sin(x * 11 + z * 4) * Math.cos(y * 9 - z * 7) * 0.065 + Math.sin(z * 15 + y * 6) * 0.025;
    vertices.setXYZ(i, x * r, y * r, z * r);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** A tapered leaf follows a naturally drooping arc, with a shallow folded spine. */
function createPalmFrond() {
  const vertices: number[] = [];
  const indices: number[] = [];
  const segments = 12;
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const halfWidth = Math.sin(Math.PI * t) * 0.36 * (1 - t * 0.3);
    const y = Math.sin(t * Math.PI * 0.8) * 0.8 - t * t * 1.65;
    const z = t * 3.8;
    vertices.push(-halfWidth, y, z, 0, y + halfWidth * 0.2, z, halfWidth, y, z);
    if (i < segments) {
      const n = i * 3;
      indices.push(n, n + 3, n + 1, n + 1, n + 3, n + 4, n + 1, n + 4, n + 2, n + 2, n + 4, n + 5);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export default function Planting({ quality }: { quality: 'high' | 'low' }) {
  const density = quality === 'high' ? 1 : 0.5;
  const { trunks, crowns, palmTrunks, palmLeaves, shrubs, flowers, mulch, hedges } = useMemo(() => {
    const random = mulberry32(20260907);
    const trees: TreeSpot[] = [];
    const palms: TreeSpot[] = [];
    const greens = ['#527740', '#648746', '#456e3c', '#78944e', '#5e8247', '#42663d'];
    const pushTree = (x: number, z: number, scale = 1) => {
      if (!clearOfRoads(x, z) || !clearOfArchitecture(x, z)) return;
      if (trees.some((tree) => Math.hypot(tree.x - x, tree.z - z) < 4.8)) return;
      trees.push({ x, z, scale, tone: greens[Math.floor(random() * greens.length)] });
    };

    // Regular entrance trees establish the scale before the more informal park.
    for (const x of [-94, -72, -50, 50, 72, 94]) pushTree(x, 18, 0.9 + random() * 0.15);
    for (let z = 42; z < 179; z += 17) {
      for (const x of [-30.5, 30.5]) pushTree(x + (random() - 0.5) * 2, z, 0.9 + random() * 0.3);
    }
    for (let i = 0; i < 75 * density; i += 1) {
      const x = GREEN.parkMinX + 3 + random() * (GREEN.parkMaxX - GREEN.parkMinX - 6);
      const z = GREEN.parkMinZ + 3 + random() * (GREEN.parkMaxZ - GREEN.parkMinZ - 6);
      pushTree(x, z, 0.85 + random() * 0.5);
    }
    for (let x = SITE.minX + 10; x < SITE.maxX - 8; x += 17) pushTree(x, 180.5, 0.9 + random() * 0.15);
    // A tree belt beyond the wall grounds the development in its surroundings.
    for (let z = 24; z < 220; z += 17) {
      pushTree(-127 - random() * 7, z, 1 + random() * 0.4);
      pushTree(127 + random() * 7, z, 1 + random() * 0.4);
    }
    for (let i = 0; i < 150 * density; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 180 + random() * 600;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.9 + 80;
      if (Math.abs(z + 4) < 31 && Math.abs(x) < 440) continue;
      if (x > -123 && x < 123 && z > 0 && z < 195) continue;
      pushTree(x, z, 0.9 + random() * 1.3);
    }

    for (const x of [-35, 35]) {
      for (const z of [17, 48, 69, 121, 171]) {
        if (clearOfRoads(x, z, 2.5) && clearOfArchitecture(x, z)) {
          palms.push({ x, z, scale: 0.88 + random() * 0.2, tone: '#638648' });
        }
      }
    }
    for (const x of [-10.5, 10.5]) {
      for (const z of [17, 69, 123]) {
        if (clearOfRoads(x, z, 2.8) && clearOfArchitecture(x, z)) {
          palms.push({ x, z, scale: 0.9 + random() * 0.15, tone: '#6d8e4c' });
        }
      }
    }

    const trunks: InstanceDef[] = [];
    const crowns: InstanceDef[] = [];
    const palmTrunks: InstanceDef[] = [];
    const palmLeaves: InstanceDef[] = [];
    const shrubs: InstanceDef[] = [];
    const flowers: InstanceDef[] = [];
    const mulch: InstanceDef[] = [];
    const hedges: InstanceDef[] = [];
    trees.forEach((tree, index) => {
      const s = tree.scale;
      const lean = (random() - 0.5) * 0.3;
      const trunkHeight = (3.9 + random() * 1.4) * s;
      const treeColor = new THREE.Color(tree.tone);
      trunks.push({ position: [tree.x, trunkHeight / 2, tree.z], scale: [0.42 * s, trunkHeight, 0.42 * s], rotation: [0, 0, lean * 0.2], color: '#7e674b' });
      const lobeCount = quality === 'high' ? 7 : 4;
      for (let lobe = 0; lobe < lobeCount; lobe += 1) {
        const angle = (lobe / lobeCount) * Math.PI * 2 + index * 1.4;
        const ring = lobe === 0 ? 0 : (0.8 + random() * 1.1) * s;
        const crownY = trunkHeight + (lobe === 0 ? 1.4 : 0.25 + random() * 1.1) * s;
        const x = tree.x + Math.cos(angle) * ring + lean;
        const z = tree.z + Math.sin(angle) * ring;
        const leafTone = treeColor.clone().lerp(new THREE.Color(lobe === 0 ? '#b0bd6a' : '#93a65d'), lobe === 0 ? 0.24 : random() * 0.13);
        const r = (lobe === 0 ? 2.1 : 1.45 + random() * 0.45) * s;
        crowns.push({ position: [x, crownY, z], scale: [r, r * (0.8 + random() * 0.4), r * (0.9 + random() * 0.3)], rotation: [random(), random() * Math.PI, random() * 0.5], color: `#${leafTone.getHexString()}` });
        if (lobe > 0 && lobe < 4) trunks.push(branchBetween(new THREE.Vector3(tree.x, trunkHeight * 0.65, tree.z), new THREE.Vector3(x, crownY, z), 0.12 * s, '#796145'));
      }
      if (Math.abs(tree.x) < 120 && tree.z < 190) {
        mulch.push({ position: [tree.x, 0.075, tree.z], scale: [1.05 * s, 0.08, 1.05 * s], color: '#79664b' });
      }
    });

    palms.forEach((palm, index) => {
      const s = palm.scale;
      // Segmented, tapered cylinders keep the trunk connected to the crown.
      for (let segment = 0; segment < 5; segment += 1) {
        const t = segment / 5;
        palmTrunks.push({ position: [palm.x + t * t * 0.65, (segment * 1.65 + 0.825) * s, palm.z], scale: [(0.29 - t * 0.1) * s, 1.72 * s, (0.29 - t * 0.1) * s], rotation: [0, 0, -t * 0.07], color: segment % 2 ? '#a58b63' : '#947953' });
      }
      const count = quality === 'high' ? 11 : 8;
      for (let i = 0; i < count; i += 1) {
        palmLeaves.push({ position: [palm.x + 0.48, 8.15 * s, palm.z], scale: [s * (0.85 + random() * 0.3), s, s * (0.85 + random() * 0.3)], rotation: [(i % 3) * 0.14 - 0.12, (i / count) * Math.PI * 2 + index, 0], color: i % 3 === 0 ? '#8caa5c' : palm.tone });
      }
      crowns.push({ position: [palm.x + 0.48, 8.1 * s, palm.z], scale: [0.65 * s, 0.65 * s, 0.65 * s], color: '#57723c' });
      mulch.push({ position: [palm.x, 0.075, palm.z], scale: [1.05 * s, 0.08, 1.05 * s], color: '#79664b' });
    });

    // Small flowering drifts give the park a planted, maintained character.
    for (const [bedX, bedZ, length] of [[21, 166, 9], [22, 127, 9], [-29, 130, 7], [-29, 69, 6], [29, 67, 6]] as const) {
      for (let i = 0; i < length * 3 * density; i += 1) {
        const x = bedX + (random() - 0.5) * 2.6;
        const z = bedZ + (random() - 0.5) * length;
        if (!clearOfRoads(x, z, 2.7) || !clearOfArchitecture(x, z)) continue;
        shrubs.push({ position: [x, 0.36 + random() * 0.15, z], scale: [0.55 + random() * 0.35, 0.4 + random() * 0.35, 0.6 + random() * 0.3], color: greens[Math.floor(random() * greens.length)] });
        for (let bloom = 0; bloom < 3; bloom += 1) {
          flowers.push({ position: [x + (random() - 0.5) * 0.55, 0.83 + random() * 0.18, z + (random() - 0.5) * 0.55], scale: [0.12, 0.1, 0.12], color: ['#e8d2a0', '#c58b80', '#c0adce', '#d2be80'][Math.floor(random() * 4)] });
        }
      }
    }
    for (const side of [-1, 1]) {
      for (let z = 38; z < 70; z += 1.5) {
        const x = side * 33.2;
        if (clearOfRoads(x, z, 2.4)) hedges.push({ position: [x, 0.48, z], scale: [0.7, 0.55, 0.9], color: '#547640' });
      }
    }
    return { trunks, crowns, palmTrunks, palmLeaves, shrubs, flowers, mulch, hedges };
  }, [density, quality]);

  const trunkGeometry = useMemo(() => new THREE.CylinderGeometry(0.68, 1, 1, 9), []);
  const crownGeometry = useMemo(createCrownGeometry, []);
  const frondGeometry = useMemo(createPalmFrond, []);
  const mulchGeometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 20), []);
  const flowerGeometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const barkMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.96 }), []);
  const foliageMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.91 }), []);
  const frondMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.84, side: THREE.DoubleSide }), []);
  const soilMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 1 }), []);
  const flowerMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.86 }), []);

  return (
    <group>
      <Instances geometry={trunkGeometry} material={barkMaterial} items={trunks} castShadow={quality === 'high'} receiveShadow interactive={false} />
      <Instances geometry={crownGeometry} material={foliageMaterial} items={crowns} castShadow={quality === 'high'} receiveShadow interactive={false} />
      <Instances geometry={trunkGeometry} material={barkMaterial} items={palmTrunks} castShadow={quality === 'high'} interactive={false} />
      <Instances geometry={frondGeometry} material={frondMaterial} items={palmLeaves} castShadow={quality === 'high'} receiveShadow interactive={false} />
      <Instances geometry={crownGeometry} material={foliageMaterial} items={[...shrubs, ...hedges]} receiveShadow interactive={false} />
      <Instances geometry={mulchGeometry} material={soilMaterial} items={mulch} receiveShadow interactive={false} />
      {quality === 'high' && <Instances geometry={flowerGeometry} material={flowerMaterial} items={flowers} interactive={false} />}
    </group>
  );
}
