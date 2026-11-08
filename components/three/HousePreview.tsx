'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useExplorerStore } from '@/lib/store';
import { getLabelTexture } from '@/lib/three/assets';
import type { Plot } from '@/lib/types';

/**
 * A conceptual, scaled massing study dropped onto the selected parcel.
 * Deliberately diagrammatic: it is not a sanctioned plan and is labelled as
 * such both in the scene and in the interface.
 */
export default function HousePreview() {
  const plot = useExplorerStore((state) => state.plots.find((item) => item.id === state.selectedId));
  const style = useExplorerStore((state) => state.houseStyle);

  const labelTexture = useMemo(() => getLabelTexture('Concept only'), []);

  const model = useMemo(() => {
    if (!plot || style === 'none') return null;

    const frontIsSouth = plot.facing === 'south';
    const direction = frontIsSouth ? 1 : -1;
    const setbackFront = 3.6;
    const setbackBack = 5.5;
    const availableDepth = plot.depth - setbackFront - setbackBack;
    const availableWidth = plot.width - 8;

    const houseW = Math.min(10.6, Math.max(7.2, availableWidth - 1.6));
    const houseD = Math.min(8.2, Math.max(6.4, availableDepth - 2.6));
    const centerZ = frontIsSouth
      ? plot.maxZ - setbackBack - houseD / 2
      : plot.minZ + setbackBack + houseD / 2;

    const porchZ = centerZ - direction * (houseD / 2 + 1.4);
    const drivewayLength = Math.abs(porchZ - direction * (frontIsSouth ? plot.minZ : plot.maxZ)) + 1.5;

    return {
      plot,
      houseW,
      houseD,
      centerZ,
      porchZ,
      drivewayLength,
      direction,
      frontIsSouth,
    };
  }, [plot, style]);

  if (!model) return null;

  const { houseW, houseD, centerZ, porchZ, drivewayLength, direction, plot: target } = model;
  const wallHeight = 3.05;

  return (
    <group>
      {/* ground plane of the plot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[target.x, 0.26, target.z]}>
        <planeGeometry args={[target.width - 3.2, target.depth - 3.2]} />
        <meshStandardMaterial color="#7d9553" roughness={1} transparent opacity={0.62} />
      </mesh>

      {/* plinth */}
      <mesh position={[target.x, 0.18, centerZ]}>
        <boxGeometry args={[houseW + 1.4, 0.36, houseD + 1.4]} />
        <meshStandardMaterial color="#b6ad9a" roughness={0.95} />
      </mesh>

      {/* ground floor */}
      <mesh position={[target.x, 0.36 + wallHeight / 2, centerZ]} castShadow receiveShadow>
        <boxGeometry args={[houseW, wallHeight, houseD]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.82} />
      </mesh>

      {/* flat roof slab */}
      <mesh position={[target.x, 0.36 + wallHeight + 0.17, centerZ]} castShadow>
        <boxGeometry args={[houseW + 1.1, 0.34, houseD + 1.1]} />
        <meshStandardMaterial color="#b3a993" roughness={0.9} />
      </mesh>

      {style === 'double' && (
        <>
          <mesh position={[target.x, 0.36 + wallHeight + 0.34 + 1.45, centerZ]} castShadow>
            <boxGeometry args={[houseW * 0.82, 2.9, houseD * 0.78]} />
            <meshStandardMaterial color="#e7dcc6" roughness={0.82} />
          </mesh>
          <mesh position={[target.x, 0.36 + wallHeight + 0.34 + 3.0, centerZ]} castShadow>
            <boxGeometry args={[houseW * 0.82 + 0.9, 0.3, houseD * 0.78 + 0.9]} />
            <meshStandardMaterial color="#a89d88" roughness={0.9} />
          </mesh>
        </>
      )}

      {/* porch canopy + posts */}
      <mesh position={[target.x, 0.36 + wallHeight - 0.12, porchZ]} castShadow>
        <boxGeometry args={[houseW * 0.5, 0.2, 2.7]} />
        <meshStandardMaterial color="#c3b79c" roughness={0.9} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[target.x + side * houseW * 0.22, 0.36 + wallHeight / 2 - 0.2, porchZ - direction * 1.1]}
          castShadow
        >
          <boxGeometry args={[0.2, wallHeight - 0.3, 0.2]} />
          <meshStandardMaterial color="#e0d5bd" roughness={0.85} />
        </mesh>
      ))}

      {/* glazing + door */}
      <mesh position={[target.x - houseW * 0.2, 0.36 + wallHeight * 0.56, centerZ - direction * (houseD / 2 + 0.03)]}>
        <boxGeometry args={[houseW * 0.34, 1.45, 0.08]} />
        <meshStandardMaterial color="#2b3a40" roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[target.x + houseW * 0.24, 0.36 + wallHeight * 0.42, centerZ - direction * (houseD / 2 + 0.04)]}>
        <boxGeometry args={[1.25, 2.4, 0.1]} />
        <meshStandardMaterial color="#6d4a31" roughness={0.6} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={`side-${side}`}
          position={[target.x + side * (houseW / 2 + 0.03), 0.36 + wallHeight * 0.58, centerZ]}
        >
          <boxGeometry args={[0.08, 1.2, houseD * 0.34]} />
          <meshStandardMaterial color="#2b3a40" roughness={0.2} metalness={0.5} />
        </mesh>
      ))}

      {/* driveway */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[
          target.x,
          0.28,
          (porchZ + direction * (target.facing === 'south' ? target.minZ : target.maxZ)) / 2,
        ]}
      >
        <planeGeometry args={[3.4, drivewayLength]} />
        <meshStandardMaterial color="#c3bbab" roughness={1} />
      </mesh>

      {/* two trees on the plot */}
      {[
        [target.minX + 2.6, target.minZ + 4.2],
        [target.maxX - 2.6, target.minZ + 4.2],
      ].map(([x, z], index) => (
        <group key={index} position={[x, 0.26, z]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.14, 0.18, 2.2, 6]} />
            <meshStandardMaterial color="#6b5540" roughness={0.95} />
          </mesh>
          <mesh position={[0, 2.9, 0]} castShadow>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshStandardMaterial color="#5f7c43" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}

      <sprite position={[target.x, 7.2, centerZ]} scale={[5.4, 2.03, 1]}>
        <spriteMaterial map={labelTexture} transparent depthTest={false} depthWrite={false} />
      </sprite>
    </group>
  );
}
