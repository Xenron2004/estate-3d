'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { mulberry32 } from '@/lib/three/assets';
import { paintSitePlan, paintTerrain, PLAN } from '@/lib/three/plan-painter';
import { createSurfaceTexture } from '@/lib/three/surfaces';
import Instances, { type InstanceDef } from './Instances';
import { ROADS } from '@/lib/data/township';
import { PARK_TRAIL_POINTS } from '@/lib/three/park-trail';
import { DISTRICT_BOUNDS } from '@/lib/data/apartment-district';

function useCanvasTexture(width: number, height: number, painter: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    painter(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [width, height, painter]);
}

function DirtTrack({ points, width = 3.4, height = 0.025, color = '#b3a482', closed = false, avoidRoads = false }: { points: [number, number][]; width?: number; height?: number; color?: string; closed?: boolean; avoidRoads?: boolean }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(point[0], height, point[1])),
      closed,
      'catmullrom',
      0.35,
    );
    const segments = closed ? 160 : 48;
    const vertices: number[] = [];
    const uvs: number[] = [];
    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(width / 2);
      vertices.push(point.x + normal.x, point.y, point.z + normal.z);
      vertices.push(point.x - normal.x, point.y, point.z - normal.z);
      uvs.push(0, t * 12, 1, t * 12);
    }
    const indices: number[] = [];
    for (let i = 0; i < segments; i += 1) {
      const point = curve.getPoint((i + 0.5) / segments);
      if (avoidRoads && Object.values(ROADS).some((road) => {
        const along = road.axis === 'x' ? point.x : point.z;
        const across = road.axis === 'x' ? point.z : point.x;
        return along > road.from - 1 && along < road.to + 1 && Math.abs(across - road.center) < road.width / 2 + 1.5;
      })) continue;
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [points, width, height, closed, avoidRoads]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

export default function SiteGround({ quality }: { quality: 'high' | 'low' }) {
  const planTexture = useCanvasTexture(2048, 1655, paintSitePlan);
  const terrainTexture = useCanvasTexture(1024, 1024, paintTerrain);
  const groundGrain = useMemo(() => createSurfaceTexture('soil', 55, 44), []);
  const terrainGrain = useMemo(() => createSurfaceTexture('grass', 200, 200), []);
  const contextBox = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const contextMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.92 }), []);
  const contextGlass = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.16 }), []);

  useMemo(() => {
    terrainTexture.wrapS = THREE.RepeatWrapping;
    terrainTexture.wrapT = THREE.RepeatWrapping;
    terrainTexture.repeat.set(7, 7);
    terrainTexture.needsUpdate = true;
  }, [terrainTexture]);

  const buildings = useMemo(() => {
    const random = mulberry32(4242);
    const buildings: InstanceDef[] = [];
    const contextTrim: InstanceDef[] = [];
    const contextWindows: InstanceDef[] = [];
    const tones = ['#cbbfa6', '#b9ad95', '#d6c8ad', '#a9a292', '#c3b193', '#b5ac9c'];
    for (let i = 0; i < 44; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 190 + random() * 620;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.85 + 60;
      if (Math.abs(z + 4) < 42 && Math.abs(x) < 420) continue; // keep the arterial clear
      const width = 8 + random() * 20;
      const depth = 8 + random() * 18;
      const height = 3.6 + random() * 9;
      // Keep the new apartment precinct and its approach clear of random context buildings.
      if (x + width / 2 > DISTRICT_BOUNDS.minX - 5 && x - width / 2 < DISTRICT_BOUNDS.maxX + 5 &&
        z + depth / 2 > 183 && z - depth / 2 < DISTRICT_BOUNDS.maxZ + 5) continue;
      buildings.push({
        position: [x, height / 2, z],
        scale: [width, height, depth],
        color: tones[Math.floor(random() * tones.length)],
      });
      contextTrim.push({ position: [x, height + 0.2, z], scale: [width + 0.5, 0.4, depth + 0.5], color: '#e2d8c5' });
      if (i % 3 === 0) {
        buildings.push({ position: [x + width * 0.15, height + 1.2, z - depth * 0.15], scale: [width * 0.48, 2.4, depth * 0.55], color: '#c2b69d' });
      }
      for (let floor = 0; floor < Math.floor(height / 3); floor += 1) {
        for (let bay = -1; bay <= 1; bay += 1) {
          for (const side of [-1, 1]) contextWindows.push({ position: [x + bay * width * 0.27, 1.7 + floor * 3, z + side * (depth / 2 + 0.025)], scale: [width * 0.13, 1.3, 0.08], color: '#667c7c' });
        }
      }
    }
    return { masses: buildings, trim: contextTrim, windows: contextWindows };
  }, []);

  const hills = useMemo(() => {
    const random = mulberry32(99);
    return Array.from({ length: 5 }, (_, index) => ({
      position: [
        -900 + index * 460 + random() * 160,
        0,
        700 + random() * 450,
      ] as [number, number, number],
      scale: [420 + random() * 260, 18 + random() * 16, 320 + random() * 220] as [number, number, number],
      color: ['#8e9b96', '#87958f', '#97a29a', '#7f8f8a', '#8b9891'][index],
    }));
  }, []);

  const planWidth = PLAN.maxX - PLAN.minX;
  const planDepth = PLAN.maxZ - PLAN.minZ;
  const planCenterZ = (PLAN.maxZ + PLAN.minZ) / 2;

  return (
    <group>
      {/* terrain beyond the development */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 40]} receiveShadow>
        <planeGeometry args={[2600, 2600]} />
        <meshStandardMaterial map={terrainTexture} bumpMap={terrainGrain} bumpScale={0.1} roughness={1} metalness={0} color="#e2e5c5" />
      </mesh>

      {/* painted master plan ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, planCenterZ]} receiveShadow>
        <planeGeometry args={[planWidth, planDepth]} />
        <meshStandardMaterial map={planTexture} bumpMap={groundGrain} bumpScale={0.045} roughness={0.98} metalness={0} />
      </mesh>

      {/* Raised fine-grain park paving follows the walkers around the conservatory. */}
      <DirtTrack points={PARK_TRAIL_POINTS} width={2.2} height={0.065} color="#c9c3b1" closed avoidRoads />

      {/* dirt tracks leaving the site */}
      <DirtTrack points={[[-150, 210], [-260, 300], [-420, 360], [-620, 430]]} />
      <DirtTrack points={[[130, 220], [250, 300], [400, 360], [560, 420]]} />
      <DirtTrack points={[[-40, 330], [30, 420], [120, 520], [240, 620]]} width={2.6} />

      {/* distant low-rise context */}
      {quality === 'high' && (
        <group>
          <Instances geometry={contextBox} material={contextMaterial} items={buildings.masses} interactive={false} />
          <Instances geometry={contextBox} material={contextMaterial} items={buildings.trim} interactive={false} />
          <Instances geometry={contextBox} material={contextGlass} items={buildings.windows} interactive={false} />
          {/* water tower */}
          <group position={[186, 0, 236]}>
            <mesh position={[0, 11, 0]} castShadow>
              <cylinderGeometry args={[3.4, 3.4, 8, 12]} />
              <meshStandardMaterial color="#cfc6b4" roughness={0.9} />
            </mesh>
            <mesh position={[0, 4, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 8, 6]} />
              <meshStandardMaterial color="#a9a08c" />
            </mesh>
          </group>
          {/* small roadside temple for context */}
          <group position={[-196, 0, 58]} rotation={[0, 0.3, 0]}>
            <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[12, 4.8, 9]} />
              <meshStandardMaterial color="#d9cbb0" roughness={0.9} />
            </mesh>
            <mesh position={[0, 6.4, 0]} castShadow>
              <coneGeometry args={[3.6, 4.2, 4]} />
              <meshStandardMaterial color="#c2a978" roughness={0.85} />
            </mesh>
            <mesh position={[0, 9.2, 0]}>
              <sphereGeometry args={[0.9, 12, 10]} />
              <meshStandardMaterial color="#b6964f" metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        </group>
      )}

      {/* hazy horizon */}
      {hills.map((hill, index) => (
        <mesh key={index} position={hill.position} scale={hill.scale}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color={hill.color} roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}
