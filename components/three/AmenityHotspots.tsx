'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AMENITIES } from '@/lib/data/amenities';
import { getLabelTexture } from '@/lib/three/assets';
import { useExplorerStore } from '@/lib/store';

function Hotspot({ id, name, x, z }: { id: string; name: string; x: number; z: number }) {
  const ring = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const active = useExplorerStore((state) => state.activeAmenity === id);
  const focusAmenity = useExplorerStore((state) => state.focusAmenity);
  const labelTexture = useMemo(() => getLabelTexture(name), [name]);

  useFrame((state) => {
    if (!ring.current) return;
    const material = ring.current.material as THREE.MeshBasicMaterial;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.1 + x * 0.05) * 0.12;
    ring.current.scale.setScalar(active ? pulse * 1.25 : pulse);
    material.opacity = active ? 0.95 : hovered ? 0.85 : 0.45;
  });

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={ring}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.35, 0]}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(event) => {
          event.stopPropagation();
          focusAmenity(id);
        }}
      >
        <ringGeometry args={[2.1, 2.75, 40]} />
        <meshBasicMaterial color="#f0e3c4" transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.4, 0]} onClick={(event) => {
        event.stopPropagation();
        focusAmenity(id);
      }}>
        <cylinderGeometry args={[0.09, 0.09, 2.6, 6]} />
        <meshBasicMaterial color="#f0e3c4" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshBasicMaterial color="#f6ecd6" />
      </mesh>
      {(hovered || active) && (
        <sprite position={[0, 5.4, 0]} scale={[10.5, 3.9, 1]}>
          <spriteMaterial map={labelTexture} transparent depthTest={false} depthWrite={false} />
        </sprite>
      )}
    </group>
  );
}

export default function AmenityHotspots() {
  return (
    <group>
      {AMENITIES.map((amenity) => (
        <Hotspot
          key={amenity.id}
          id={amenity.id}
          name={amenity.name}
          x={amenity.x}
          z={amenity.z}
        />
      ))}
    </group>
  );
}
