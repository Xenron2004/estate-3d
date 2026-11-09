'use client';

import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

export interface InstanceDef {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

interface Props {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  items: InstanceDef[];
  castShadow?: boolean;
  receiveShadow?: boolean;
  interactive?: boolean;
}

export default function Instances({
  geometry,
  material,
  items,
  castShadow = false,
  receiveShadow = false,
  interactive = true,
}: Props) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.count = items.length;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();

    items.forEach((item, index) => {
      position.set(item.position[0], item.position[1], item.position[2]);
      scale.set(item.scale[0], item.scale[1], item.scale[2]);
      euler.set(item.rotation?.[0] ?? 0, item.rotation?.[1] ?? 0, item.rotation?.[2] ?? 0);
      quaternion.setFromEuler(euler);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
      color.set(item.color ?? '#ffffff');
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, Math.max(items.length, 1)]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      raycast={interactive ? undefined : () => {}}
      frustumCulled={false}
    />
  );
}
