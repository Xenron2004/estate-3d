'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import Instances, { type InstanceDef } from './Instances';

const TOWERS = [
  { x: 49.43, z: 73.7 },
  { x: 68.93, z: 73.7 },
  { x: 88.43, z: 73.7 },
  { x: 49.43, z: 99.2 },
  { x: 68.93, z: 99.2 },
  { x: 88.43, z: 99.2 },
];

const FLOOR_COUNT = 5;
const FLOOR_HEIGHT = 3.05;
const TOWER_WIDTH = 11.8;
const TOWER_DEPTH = 15.4;

function ApartmentBuildings() {
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const { walls, trim, windows, balconies, rails, roofs, entries } = useMemo(() => {
    const walls: InstanceDef[] = [];
    const trim: InstanceDef[] = [];
    const windows: InstanceDef[] = [];
    const balconies: InstanceDef[] = [];
    const rails: InstanceDef[] = [];
    const roofs: InstanceDef[] = [];
    const entries: InstanceDef[] = [];

    for (const { x, z } of TOWERS) {
      const height = FLOOR_COUNT * FLOOR_HEIGHT;
      walls.push({
        position: [x, height / 2 + 0.35, z],
        scale: [TOWER_WIDTH, height, TOWER_DEPTH],
        color: '#dfd2b8',
      });
      trim.push(
        { position: [x, 0.35, z], scale: [TOWER_WIDTH + 0.8, 0.7, TOWER_DEPTH + 0.8], color: '#b7a88d' },
        { position: [x, height + 0.58, z], scale: [TOWER_WIDTH + 0.7, 0.46, TOWER_DEPTH + 0.7], color: '#c4b598' },
        { position: [x, height + 0.92, z], scale: [TOWER_WIDTH + 0.25, 0.22, TOWER_DEPTH + 0.25], color: '#eee4d0' },
      );

      for (let floor = 0; floor < FLOOR_COUNT; floor += 1) {
        const windowY = 1.8 + floor * FLOOR_HEIGHT;
        trim.push(
          { position: [x, floor * FLOOR_HEIGHT + 3.02, z - TOWER_DEPTH / 2], scale: [TOWER_WIDTH, 0.13, 0.2], color: '#f0e5d2' },
          { position: [x, floor * FLOOR_HEIGHT + 3.02, z + TOWER_DEPTH / 2], scale: [TOWER_WIDTH, 0.13, 0.2], color: '#f0e5d2' },
        );

        for (const side of [-1, 1]) {
          for (const bay of [-1, 0, 1]) {
            windows.push({
              position: [x + bay * 3.45, windowY, z + side * (TOWER_DEPTH / 2 + 0.09)],
              scale: [1.35, 1.38, 0.14],
              color: '#526b70',
            });
          }
          for (const bay of [-1, 1]) {
            windows.push({
              position: [x + side * (TOWER_WIDTH / 2 + 0.09), windowY, z + bay * 4.3],
              scale: [0.14, 1.38, 1.65],
              color: '#526b70',
            });
          }
        }

        if (floor > 0) {
          for (const bay of [-1, 1]) {
            const balconyX = x + bay * 3.1;
            const balconyZ = z + TOWER_DEPTH / 2 + 0.8;
            balconies.push({
              position: [balconyX, floor * FLOOR_HEIGHT - 0.12, balconyZ],
              scale: [2.7, 0.22, 1.75],
              color: '#eee3d1',
            });
            rails.push(
              { position: [balconyX, floor * FLOOR_HEIGHT + 0.43, balconyZ + 0.82], scale: [2.65, 0.1, 0.1], color: '#746c5d' },
              { position: [balconyX - 1.25, floor * FLOOR_HEIGHT + 0.43, balconyZ], scale: [0.1, 0.85, 1.65], color: '#746c5d' },
              { position: [balconyX + 1.25, floor * FLOOR_HEIGHT + 0.43, balconyZ], scale: [0.1, 0.85, 1.65], color: '#746c5d' },
            );
          }
        }
      }

      entries.push(
        { position: [x, 1.25, z + TOWER_DEPTH / 2 + 0.12], scale: [3.1, 2.25, 0.16], color: '#34494b' },
        { position: [x, height + 1.22, z], scale: [3.8, 0.18, 5.2], color: '#9e8053' },
      );
      for (const dx of [-1.6, 1.6]) {
        entries.push({
          position: [x + dx, height + 1.9, z],
          scale: [0.16, 1.5, 0.16],
          color: '#8e7754',
        });
      }
      roofs.push({
        position: [x, height + 0.98, z],
        scale: [TOWER_WIDTH + 0.2, 0.12, TOWER_DEPTH + 0.2],
        color: '#a99b83',
      });
    }

    return { walls, trim, windows, balconies, rails, roofs, entries };
  }, []);

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.9 }), []);
  const trimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.85 }), []);
  const windowMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.23, metalness: 0.3 }),
    [],
  );
  const balconyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8 }), []);
  const railMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0.3 }), []);
  const roofMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.9 }), []);
  const entryMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.45 }), []);

  return (
    <group>
      <Instances geometry={box} material={wallMaterial} items={walls} castShadow receiveShadow interactive={false} />
      <Instances geometry={box} material={trimMaterial} items={trim} castShadow receiveShadow interactive={false} />
      <Instances geometry={box} material={windowMaterial} items={windows} interactive={false} />
      <Instances geometry={box} material={balconyMaterial} items={balconies} castShadow receiveShadow interactive={false} />
      <Instances geometry={box} material={railMaterial} items={rails} interactive={false} />
      <Instances geometry={box} material={roofMaterial} items={roofs} interactive={false} />
      <Instances geometry={box} material={entryMaterial} items={entries} interactive={false} />
    </group>
  );
}

function SocietyCourtyard() {
  const pathMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c7bda9', roughness: 0.95 }), []);
  const lawnMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#708653', roughness: 1 }), []);
  const waterMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#6f9fa0', roughness: 0.25, metalness: 0.08 }),
    [],
  );
  const planterMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#a99a80', roughness: 0.9 }), []);

  return (
    <group>
      <mesh position={[69, 0.07, 86.45]} material={pathMaterial} raycast={() => {}}>
        <boxGeometry args={[56, 0.1, 10.2]} />
      </mesh>
      <mesh position={[69, 0.14, 86.45]} material={lawnMaterial} raycast={() => {}}>
        <boxGeometry args={[27, 0.08, 8.4]} />
      </mesh>
      <mesh position={[69, 0.24, 86.45]} material={pathMaterial} raycast={() => {}}>
        <boxGeometry args={[8.4, 0.12, 4.1]} />
      </mesh>
      <mesh position={[69, 0.34, 86.45]} material={waterMaterial} raycast={() => {}}>
        <boxGeometry args={[6.8, 0.12, 2.7]} />
      </mesh>
      {[
        [48.5, 86.45],
        [89.5, 86.45],
      ].map(([x, z]) => (
        <mesh key={x} position={[x, 0.35, z]} material={planterMaterial} raycast={() => {}}>
          <boxGeometry args={[5.2, 0.34, 1.5]} />
        </mesh>
      ))}
      <mesh position={[97.4, 0.12, 86.45]} material={pathMaterial} raycast={() => {}}>
        <boxGeometry args={[5.2, 0.08, 2.8]} />
      </mesh>
    </group>
  );
}

export default function ApartmentSociety() {
  return (
    <group>
      <SocietyCourtyard />
      <ApartmentBuildings />
    </group>
  );
}
