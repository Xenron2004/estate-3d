'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ROADS } from '@/lib/data/township';
import { createParkTrail } from '@/lib/three/park-trail';

const PARK_TRAIL = createParkTrail(0.09);

const ROAD_LOOP = new THREE.CatmullRomCurve3(
  [
    [-96, 0.14, ROADS.avenue.center - 1.25],
    [96, 0.14, ROADS.avenue.center - 1.25],
    [107.3, 0.14, ROADS.avenue.center + 7],
    [107.3, 0.14, ROADS.streetOne.center - 7],
    [96, 0.14, ROADS.streetOne.center + 1.25],
    [-96, 0.14, ROADS.streetOne.center + 1.25],
    [-107.3, 0.14, ROADS.streetOne.center - 7],
    [-107.3, 0.14, ROADS.avenue.center + 7],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  true,
  'catmullrom',
  0.35,
);

function Walker({ offset, tone, quality }: { offset: number; tone: string; quality: 'high' | 'low' }) {
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const phase = useMemo(() => offset * Math.PI * 2, [offset]);
  const skin = useMemo(() => ['#c98761', '#e0aa7d', '#a96f51', '#d59670'][Math.floor(offset * 4)], [offset]);

  useFrame((state, delta) => {
    if (!root.current) return;
    const progress = (offset + state.clock.elapsedTime * 0.0045) % 1;
    const point = PARK_TRAIL.getPointAt(progress);
    const tangent = PARK_TRAIL.getTangentAt(progress);
    root.current.position.copy(point);
    root.current.rotation.y = Math.atan2(tangent.x, tangent.z);

    const stride = Math.sin(state.clock.elapsedTime * 6.2 + phase);
    const blend = 1 - Math.exp(-delta * 12);
    if (leftArm.current) leftArm.current.rotation.x += (stride * 0.46 - leftArm.current.rotation.x) * blend;
    if (rightArm.current) rightArm.current.rotation.x += (-stride * 0.46 - rightArm.current.rotation.x) * blend;
    if (leftLeg.current) leftLeg.current.rotation.x += (-stride * 0.38 - leftLeg.current.rotation.x) * blend;
    if (rightLeg.current) rightLeg.current.rotation.x += (stride * 0.38 - rightLeg.current.rotation.x) * blend;
    root.current.position.y += Math.abs(stride) * 0.035;
  });

  return (
    <group ref={root}>
      <mesh position={[0, 1.08, 0]} castShadow={quality === 'high'}>
        <capsuleGeometry args={[0.26, 0.56, 4, 8]} />
        <meshStandardMaterial color={tone} roughness={0.88} />
      </mesh>
      <mesh position={[0, 1.79, 0.025]} castShadow={quality === 'high'}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color={skin} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.02, 0.015]}>
        <sphereGeometry args={[0.225, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
        <meshStandardMaterial color="#493a32" roughness={0.94} />
      </mesh>
      {[leftArm, rightArm].map((arm, index) => (
        <group key={`arm-${index}`} ref={arm} position={[index === 0 ? -0.32 : 0.32, 1.38, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow={quality === 'high'}>
            <capsuleGeometry args={[0.105, 0.37, 3, 6]} />
            <meshStandardMaterial color={tone} roughness={0.88} />
          </mesh>
          <mesh position={[0, -0.48, 0.015]}>
            <sphereGeometry args={[0.095, 8, 6]} />
            <meshStandardMaterial color={skin} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {[leftLeg, rightLeg].map((leg, index) => (
        <group key={`leg-${index}`} ref={leg} position={[index === 0 ? -0.13 : 0.13, 0.61, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow={quality === 'high'}>
            <capsuleGeometry args={[0.115, 0.34, 3, 6]} />
            <meshStandardMaterial color="#46515b" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.48, 0.1]}>
            <sphereGeometry args={[0.12, 8, 6]} />
            <meshStandardMaterial color="#473c34" roughness={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function MovingCar({
  offset,
  tone,
  quality,
}: {
  offset: number;
  tone: string;
  quality: 'high' | 'low';
}) {
  const root = useRef<THREE.Group>(null);
  const bodyGeometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.13), []);
  const wheelGeometry = useMemo(() => new THREE.CylinderGeometry(0.31, 0.31, 0.2, 12), []);
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: tone, roughness: 0.48 }), [tone]);
  const glassMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#496b77', roughness: 0.2, metalness: 0.18 }),
    [],
  );
  const wheelMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#303239', roughness: 0.8 }),
    [],
  );

  useFrame((state) => {
    if (!root.current) return;
    const progress = (offset + state.clock.elapsedTime * 0.0065) % 1;
    const point = ROAD_LOOP.getPointAt(progress);
    const tangent = ROAD_LOOP.getTangentAt(progress);
    root.current.position.copy(point);
    root.current.rotation.y = Math.atan2(tangent.x, tangent.z);
  });

  return (
    <group ref={root}>
      <mesh geometry={bodyGeometry} material={bodyMaterial} position={[0, 0.55, 0]} scale={[1.9, 0.68, 3.9]} castShadow={quality === 'high'} receiveShadow />
      <mesh geometry={bodyGeometry} material={bodyMaterial} position={[0, 0.99, 0.15]} scale={[1.55, 0.72, 2.18]} castShadow={quality === 'high'} />
      <mesh geometry={bodyGeometry} material={glassMaterial} position={[0, 1.02, 0.15]} scale={[1.42, 0.55, 2.03]} />
      {[-0.94, 0.94].flatMap((x) =>
        [-1.22, 1.22].map((z) => (
          <mesh
            key={`${x}-${z}`}
            geometry={wheelGeometry}
            material={wheelMaterial}
            position={[x, 0.31, z]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow={quality === 'high'}
          />
        )),
      )}
      {[-0.57, 0.57].map((x) => (
        <mesh key={x} position={[x, 0.56, 1.96]}>
          <sphereGeometry args={[0.12, 8, 6]} />
          <meshStandardMaterial color="#ffe4a0" emissive="#ffc65b" emissiveIntensity={0.35} roughness={0.38} />
        </mesh>
      ))}
      <mesh geometry={bodyGeometry} material={bodyMaterial} position={[0, 0.3, -1.98]} scale={[1.78, 0.2, 0.16]} />
    </group>
  );
}

export default function AnimatedLife({ quality }: { quality: 'high' | 'low' }) {
  return (
    <group>
      {[
        { offset: 0.08, tone: '#e5a84c' },
        { offset: 0.32, tone: '#628b78' },
        { offset: 0.57, tone: '#cf7060' },
        { offset: 0.81, tone: '#7280b1' },
      ].map((walker) => (
        <Walker key={walker.offset} {...walker} quality={quality} />
      ))}
      {[
        { offset: 0.05, tone: '#d6604c' },
        { offset: 0.38, tone: '#4f7d99' },
        { offset: 0.71, tone: '#e1c46e' },
      ].map((car) => (
        <MovingCar key={car.offset} {...car} quality={quality} />
      ))}
    </group>
  );
}
