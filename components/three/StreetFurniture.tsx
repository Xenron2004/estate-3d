'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import Instances, { type InstanceDef } from './Instances';
import { GREEN, ROADS, SITE } from '@/lib/data/township';
import type { TimeOfDay } from '@/lib/types';

export default function StreetFurniture({
  quality,
  timeOfDay,
}: {
  quality: 'high' | 'low';
  timeOfDay: TimeOfDay;
}) {
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const pole = useMemo(() => new THREE.CylinderGeometry(0.5, 0.5, 1, 8), []);

  const metalMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#6f6b60', roughness: 0.55, metalness: 0.5 }),
    [],
  );
  const lampMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d8d2c2',
        roughness: 0.4,
        emissive: new THREE.Color('#ffd9a0'),
        emissiveIntensity: timeOfDay === 'dusk' ? 2.4 : timeOfDay === 'golden' ? 0.9 : 0.12,
      }),
    [timeOfDay],
  );
  const woodMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85 }),
    [],
  );

  const lights = useMemo(() => {
    const poles: InstanceDef[] = [];
    const arms: InstanceDef[] = [];
    const heads: InstanceDef[] = [];

    const add = (x: number, z: number, rotation: number) => {
      poles.push({ position: [x, 3.4, z], scale: [0.24, 6.8, 0.24], color: '#6f6b60' });
      arms.push({
        position: [x + Math.sin(rotation) * 0.9, 6.7, z + Math.cos(rotation) * 0.9],
        scale: [0.14, 0.14, 1.9],
        rotation: [0, rotation, 0],
        color: '#6f6b60',
      });
      heads.push({
        position: [x + Math.sin(rotation) * 1.7, 6.62, z + Math.cos(rotation) * 1.7],
        scale: [0.42, 0.16, 0.78],
        rotation: [0, rotation, 0],
        color: '#e6e0cf',
      });
    };

    const roads: { road: (typeof ROADS)[string]; axis: 'x' | 'z'; step: number }[] = [
      { road: ROADS.avenue, axis: 'x', step: 22 },
      { road: ROADS.streetOne, axis: 'x', step: 24 },
      { road: ROADS.streetTwo, axis: 'x', step: 24 },
      { road: ROADS.spine, axis: 'z', step: 26 },
      { road: ROADS.linkWest, axis: 'z', step: 26 },
      { road: ROADS.linkEast, axis: 'z', step: 26 },
    ];

    for (const { road, axis, step } of roads) {
      for (let at = road.from + 12; at < road.to - 6; at += step) {
        const edge = road.center - road.width / 2 - 1.6;
        if (axis === 'x') add(at, edge, 0);
        else add(edge, at, Math.PI / 2);
      }
    }

    // park lamp posts
    for (const x of [-16, 16]) {
      for (const z of [132, 168]) {
        add(x, z, x < 0 ? Math.PI / 2 : -Math.PI / 2);
      }
    }

    return { poles, arms, heads };
  }, []);

  const benches = useMemo(() => {
    const items: InstanceDef[] = [];
    const addBench = (x: number, z: number, rotation: number) => {
      items.push({
        position: [x, 0.45, z],
        scale: [1.9, 0.12, 0.52],
        rotation: [0, rotation, 0],
        color: '#8a6b45',
      });
      items.push({
        position: [
          x + Math.sin(rotation + Math.PI / 2) * 0.24,
          0.78,
          z + Math.cos(rotation + Math.PI / 2) * 0.24,
        ],
        scale: [1.9, 0.5, 0.1],
        rotation: [0, rotation, 0],
        color: '#7d6040',
      });
      for (const dx of [-0.75, 0.75]) {
        items.push({
          position: [
            x + Math.cos(rotation) * dx,
            0.22,
            z - Math.sin(rotation) * dx,
          ],
          scale: [0.12, 0.44, 0.5],
          color: '#5d5952',
        });
      }
    };

    for (let i = 0; i < 12; i += 1) {
      const angle = (i / 12) * Math.PI * 2;
      addBench(Math.cos(angle) * 12, 150 + Math.sin(angle) * 12, -angle + Math.PI / 2);
    }
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      addBench(Math.cos(angle) * 17, 150 + Math.sin(angle) * 17, -angle + Math.PI / 2);
    }
    for (let i = 0; i < 6; i += 1) {
      const z = GREEN.beltMinZ + 12 + i * 13;
      addBench(-9.5, z, Math.PI / 2);
      addBench(9.5, z, -Math.PI / 2);
    }
    return items;
  }, []);

  const bins = useMemo(() => {
    const items: InstanceDef[] = [];
    for (const z of [40, 92.14, 148.28]) {
      items.push({ position: [-8.4, 0.5, z + 3], scale: [0.5, 1, 0.5], color: '#4a5a4e' });
      items.push({ position: [8.4, 0.5, z + 3], scale: [0.5, 1, 0.5], color: '#4a5a4e' });
    }
    return items;
  }, []);

  const cars = useMemo(() => {
    const bodies: InstanceDef[] = [];
    const cabins: InstanceDef[] = [];
    const wheels: InstanceDef[] = [];
    const colours = ['#8e2f2a', '#2f4d63', '#d9d3c4', '#3c4038', '#b5b1a4', '#5a6b52'];

    const addCar = (x: number, z: number, rotation: number, tone: string) => {
      bodies.push({
        position: [x, 0.62, z],
        scale: [1.85, 0.82, 4.3],
        rotation: [0, rotation, 0],
        color: tone,
      });
      cabins.push({
        position: [x - Math.sin(rotation) * 0.2, 1.28, z - Math.cos(rotation) * 0.2],
        scale: [1.62, 0.68, 2.2],
        rotation: [0, rotation, 0],
        color: '#26333a',
      });
      const corners: [number, number][] = [
        [-0.92, 1.45],
        [0.92, 1.45],
        [-0.92, -1.45],
        [0.92, -1.45],
      ];
      for (const [dx, dz] of corners) {
        wheels.push({
          position: [
            x + dx * Math.cos(rotation) + dz * Math.sin(rotation),
            0.34,
            z - dx * Math.sin(rotation) + dz * Math.cos(rotation),
          ],
          scale: [0.66, 0.34, 0.66],
          rotation: [0, rotation, Math.PI / 2],
          color: '#22242a',
        });
      }
    };

    const parkingSpots: [number, number, number][] = [
      [-27, 13, 0],
      [-21, 13, 0],
      [21, 13, 0],
      [27, 13, 0],
      [-27, 21, 0],
      [27, 21, 0],
    ];
    parkingSpots.forEach(([x, z, rotation], index) => addCar(x, z, rotation, colours[index % colours.length]));
    addCar(-70, 26.4, Math.PI / 2, colours[1]);
    addCar(-46, 33.6, -Math.PI / 2, colours[4]);
    addCar(64, 26.4, Math.PI / 2, colours[0]);
    return { bodies, cabins, wheels };
  }, []);

  const utility = useMemo(() => {
    const poles: InstanceDef[] = [];
    const arms: InstanceDef[] = [];
    const positions: [number, number][] = [];
    for (let z = 40; z <= 140; z += 25) {
      positions.push([112, z]);
      poles.push({ position: [112, 4.6, z], scale: [0.3, 9.2, 0.3], color: '#7a7264' });
      arms.push({ position: [111.2, 8.4, z], scale: [2.4, 0.16, 0.16], color: '#6e6759' });
    }
    return { poles, arms, positions };
  }, []);

  const wires = useMemo(() => {
    const lines: THREE.Line[] = [];
    const positions = utility.positions;
    for (let i = 0; i < positions.length - 1; i += 1) {
      const a = positions[i];
      const b = positions[i + 1];
      for (const offset of [-0.8, 0, 0.8]) {
        const points: THREE.Vector3[] = [];
        for (let s = 0; s <= 10; s += 1) {
          const t = s / 10;
          const x = a[0] + (b[0] - a[0]) * t + offset;
          const z = a[1] + (b[1] - a[1]) * t;
          const sag = Math.sin(t * Math.PI) * 1.1;
          points.push(new THREE.Vector3(x, 8.3 - sag, z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: '#4d4a43', transparent: true, opacity: 0.7 });
        lines.push(new THREE.Line(geometry, material));
      }
    }
    return lines;
  }, [utility.positions]);

  return (
    <group>
      <Instances geometry={pole} material={metalMaterial} items={lights.poles} castShadow={quality === 'high'} />
      <Instances geometry={box} material={metalMaterial} items={lights.arms} />
      <Instances geometry={box} material={lampMaterial} items={lights.heads} />
      <Instances geometry={box} material={woodMaterial} items={benches} castShadow={quality === 'high'} receiveShadow />
      <Instances geometry={box} material={metalMaterial} items={bins} castShadow={quality === 'high'} />
      <Instances geometry={box} material={metalMaterial} items={cars.bodies} castShadow={quality === 'high'} receiveShadow />
      <Instances geometry={box} material={metalMaterial} items={cars.cabins} castShadow={quality === 'high'} />
      <Instances geometry={pole} material={metalMaterial} items={cars.wheels} />
      <Instances geometry={pole} material={metalMaterial} items={utility.poles} castShadow={quality === 'high'} />
      <Instances geometry={box} material={metalMaterial} items={utility.arms} />
      {wires.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
    </group>
  );
}
