'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import Instances, { type InstanceDef } from './Instances';
import { mulberry32 } from '@/lib/three/assets';
import { GREEN, ROADS, SITE } from '@/lib/data/township';

interface TreeSpot {
  x: number;
  z: number;
  scale: number;
  tone: string;
}

export default function Planting({ quality }: { quality: 'high' | 'low' }) {
  const density = quality === 'high' ? 1 : 0.45;

  const { broadTrunks, broadCanopies, palms, shrubs, hedges } = useMemo(() => {
    const random = mulberry32(20260907);
    const trees: TreeSpot[] = [];
    const palmTrees: TreeSpot[] = [];
    const shrubSpots: InstanceDef[] = [];
    const hedgeSpots: InstanceDef[] = [];

    const greens = ['#5f7c43', '#6b8749', '#54713b', '#779055', '#4f6b38'];

    const pushTree = (x: number, z: number, scale = 1, tone?: string) => {
      trees.push({ x, z, scale, tone: tone ?? greens[Math.floor(random() * greens.length)] });
    };

    // street trees along the internal roads
    const streetRows: { axis: 'x' | 'z'; road: (typeof ROADS)[string]; offset: number }[] = [
      { axis: 'x', road: ROADS.avenue, offset: 1 },
      { axis: 'x', road: ROADS.streetOne, offset: 1 },
      { axis: 'x', road: ROADS.streetTwo, offset: 1 },
      { axis: 'z', road: ROADS.spine, offset: 1 },
      { axis: 'z', road: ROADS.linkWest, offset: 1 },
      { axis: 'z', road: ROADS.linkEast, offset: 1 },
    ];

    for (const row of streetRows) {
      const { axis, road } = row;
      const step = 16;
      for (let at = road.from + 8; at < road.to - 8; at += step) {
        for (const side of [1, -1]) {
          if (random() > 0.72) continue;
          const jitter = (random() - 0.5) * 2.4;
          const edge = road.center + side * (road.width / 2 + 3.6);
          if (axis === 'x') pushTree(at + jitter, edge, 0.85 + random() * 0.35);
          else pushTree(edge, at + jitter, 0.85 + random() * 0.35);
        }
      }
    }

    // park planting
    for (let i = 0; i < 90 * density; i += 1) {
      const x = GREEN.parkMinX + random() * (GREEN.parkMaxX - GREEN.parkMinX);
      const z = GREEN.parkMinZ + random() * (GREEN.parkMaxZ - GREEN.parkMinZ);
      if (Math.hypot(x, z - 150) < 11) continue;
      pushTree(x, z, 1 + random() * 0.5);
    }

    // green belt planting
    for (let i = 0; i < 60 * density; i += 1) {
      const west = random() > 0.5;
      const x = west
        ? GREEN.beltMinX + random() * (GREEN.beltMaxX - GREEN.beltMinX)
        : GREEN.beltMinX + random() * (GREEN.beltMaxX - GREEN.beltMinX);
      const z = GREEN.beltMinZ + random() * (GREEN.beltMaxZ - GREEN.beltMinZ);
      const offset = x < 0 ? -4.57 - x : x - 4.57;
      if (offset < 4) continue;
      pushTree(x, z, 0.8 + random() * 0.4);
    }

    // perimeter avenue of trees
    for (let z = SITE.minZ + 12; z < SITE.maxZ - 10; z += 13) {
      pushTree(SITE.minX + 6 + random() * 2, z, 0.9);
      pushTree(SITE.maxX - 6 - random() * 2, z, 0.9);
    }

    // palms along the spine and the entrance
    for (let z = 22; z < 176; z += 19) {
      const side = random() > 0.5 ? 1 : -1;
      palmTrees.push({
        x: side * (7.5 + random() * 1.5),
        z: z + random() * 4,
        scale: 0.9 + random() * 0.3,
        tone: '#6f8a4e',
      });
    }
    for (let i = 0; i < 10; i += 1) {
      palmTrees.push({
        x: (random() > 0.5 ? 1 : -1) * (16 + random() * 12),
        z: SITE.minZ + 6 + random() * 16,
        scale: 0.85 + random() * 0.4,
        tone: '#6f8a4e',
      });
    }

    // scrub and trees beyond the compound
    for (let i = 0; i < 320 * density; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 150 + random() * 620;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.9 + 70;
      if (Math.abs(z + 4) < 30 && Math.abs(x) < 430) continue;
      pushTree(x, z, 0.7 + random() * 0.8);
    }

    // hedges around the clubhouse terrace and the play court
    for (let x = GREEN.clubhouseTerrace.minX; x < GREEN.clubhouseTerrace.maxX; x += 2.4) {
      hedgeSpots.push({ position: [x, 0.45, GREEN.clubhouseTerrace.maxZ - 0.6], scale: [2.2, 0.9, 0.9], color: '#4f6b38' });
    }
    for (let i = 0; i < 26; i += 1) {
      shrubSpots.push({
        position: [
          GREEN.playMinX - 1.5 + random() * (GREEN.playMaxX - GREEN.playMinX + 3),
          0.5,
          GREEN.playMinZ - 1.5 + random() * (GREEN.playMaxZ - GREEN.playMinZ + 3),
        ],
        scale: [1.1, 0.95, 1.1],
        color: greens[Math.floor(random() * greens.length)],
      });
    }
    for (let i = 0; i < 90 * density; i += 1) {
      const z = GREEN.beltMinZ + random() * (GREEN.beltMaxZ - GREEN.beltMinZ);
      const x = (random() > 0.5 ? 1 : -1) * (12 + random() * 20);
      shrubSpots.push({
        position: [x, 0.45, z],
        scale: [1 + random(), 0.8 + random() * 0.4, 1 + random()],
        color: greens[Math.floor(random() * greens.length)],
      });
    }

    const trunkItems: InstanceDef[] = trees.map((tree) => ({
      position: [tree.x, 2.2 * tree.scale, tree.z],
      scale: [0.42 * tree.scale, 4.4 * tree.scale, 0.42 * tree.scale],
      color: '#6b5540',
    }));
    const canopyItems: InstanceDef[] = [];
    trees.forEach((tree) => {
      const crownY = (4.3 + 1.5 * tree.scale) * tree.scale;
      const highlight = new THREE.Color(tree.tone).lerp(new THREE.Color('#b6c980'), 0.18);
      canopyItems.push({
        position: [tree.x, crownY, tree.z],
        scale: [2.35 * tree.scale, 2.55 * tree.scale, 2.35 * tree.scale],
        color: tree.tone,
      });
      for (const [x, z] of [[-1, 0.25], [1, -0.2]] as const) {
        canopyItems.push({
          position: [tree.x + x * tree.scale, crownY - 0.32 * tree.scale, tree.z + z * tree.scale],
          scale: [1.65 * tree.scale, 1.75 * tree.scale, 1.65 * tree.scale],
          color: `#${highlight.getHexString()}`,
        });
      }
    });

    const palmTrunks: InstanceDef[] = palmTrees.map((palm) => ({
      position: [palm.x, 4.4 * palm.scale, palm.z],
      scale: [0.3 * palm.scale, 8.8 * palm.scale, 0.3 * palm.scale],
      rotation: [0.02, 0, 0.03],
      color: '#8a7358',
    }));
    const palmCrowns: InstanceDef[] = [];
    palmTrees.forEach((palm) => {
      for (let i = 0; i < 6; i += 1) {
        const angle = (i / 6) * Math.PI * 2;
        palmCrowns.push({
          position: [
            palm.x + Math.cos(angle) * 1.5 * palm.scale,
            8.6 * palm.scale,
            palm.z + Math.sin(angle) * 1.5 * palm.scale,
          ],
          scale: [1.5 * palm.scale, 0.28 * palm.scale, 3.4 * palm.scale],
          rotation: [0.34, -angle, 0],
          color: palm.tone,
        });
      }
    });

    return {
      broadTrunks: trunkItems,
      broadCanopies: canopyItems,
      palms: [...palmTrunks, ...palmCrowns],
      shrubs: shrubSpots,
      hedges: hedgeSpots,
    };
  }, [density]);

  const trunkGeometry = useMemo(() => new THREE.CylinderGeometry(0.42, 0.56, 1, 10), []);
  const canopyGeometry = useMemo(() => new THREE.SphereGeometry(1, 14, 12), []);
  const shrubGeometry = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const palmGeometry = useMemo(() => new THREE.ConeGeometry(1, 1, 5, 1, true), []);

  const trunkMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#6b5540', roughness: 0.95 }),
    [],
  );
  const canopyMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.94 }),
    [],
  );
  const palmMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.85,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const shrubMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.94 }),
    [],
  );

  return (
    <group>
      <Instances geometry={trunkGeometry} material={trunkMaterial} items={broadTrunks} castShadow={quality === 'high'} />
      <Instances geometry={canopyGeometry} material={canopyMaterial} items={broadCanopies} castShadow={quality === 'high'} />
      <Instances geometry={palmGeometry} material={palmMaterial} items={palms} castShadow={false} />
      <Instances geometry={shrubGeometry} material={shrubMaterial} items={shrubs} castShadow={false} receiveShadow />
      <Instances geometry={boxGeometry} material={shrubMaterial} items={hedges} castShadow={false} receiveShadow />
    </group>
  );
}
