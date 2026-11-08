'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplorerStore } from '@/lib/store';
import { getParcelFrameGeometry, getParcelGeometry, getLabelTexture, getStatusTexture } from '@/lib/three/assets';
import type { Plot } from '@/lib/types';

const STATUS_COLOR: Record<Plot['status'], string> = {
  available: '#5d8f5a',
  booked: '#c8912f',
  sold: '#9c4a3c',
};

const FRAME_COLOR: Record<Plot['status'], string> = {
  available: '#e9e3d2',
  booked: '#f0d9a8',
  sold: '#e0b3aa',
};

interface Props {
  onHover: (plot: Plot | null, clientX: number, clientY: number) => void;
}

function PlotParcel({ plot, dimmed, selected, hovered, onHover }: {
  plot: Plot;
  dimmed: boolean;
  selected: boolean;
  hovered: boolean;
  onHover: Props['onHover'];
}) {
  const group = useRef<THREE.Group>(null);
  const slab = useRef<THREE.Mesh>(null);
  const frame = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Sprite>(null);

  const geometry = useMemo(() => getParcelGeometry(plot.width, plot.depth), [plot.width, plot.depth]);
  const frameGeometry = useMemo(
    () => getParcelFrameGeometry(plot.width, plot.depth),
    [plot.width, plot.depth],
  );
  const statusTexture = useMemo(() => getStatusTexture(plot.status), [plot.status]);
  const labelTexture = useMemo(() => getLabelTexture(plot.id), [plot.id]);

  const targetColor = useMemo(() => new THREE.Color(STATUS_COLOR[plot.status]), [plot.status]);
  const targetFrame = useMemo(() => new THREE.Color(FRAME_COLOR[plot.status]), [plot.status]);
  const accent = useMemo(() => new THREE.Color('#f3e2b6'), []);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.0001, delta);
    if (slab.current) {
      const material = slab.current.material as THREE.MeshStandardMaterial;
      material.color.lerp(selected ? accent : targetColor, k * 0.6);
      const targetOpacity = dimmed ? 0.14 : selected ? 0.86 : 0.56;
      material.opacity += (targetOpacity - material.opacity) * k;
      material.emissiveIntensity += ((selected ? 0.35 : hovered ? 0.18 : 0.04) - material.emissiveIntensity) * k;
      material.emissive.copy(selected ? accent : targetColor);
    }
    if (frame.current) {
      const material = frame.current.material as THREE.MeshStandardMaterial;
      material.color.lerp(selected ? accent : hovered ? accent : targetFrame, k * 0.6);
    }
    if (group.current) {
      const targetY = selected ? 0.32 : hovered ? 0.18 : 0;
      group.current.position.y += (targetY - group.current.position.y) * k;
    }
  });

  const handlePointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(plot, event.nativeEvent.clientX, event.nativeEvent.clientY);
  };

  return (
    <group ref={group} position={[plot.x, 0, plot.z]}>
      <mesh
        ref={slab}
        geometry={geometry}
        castShadow={false}
        receiveShadow
        onPointerOver={handlePointer}
        onPointerMove={handlePointer}
        onPointerOut={() => onHover(null, 0, 0)}
        onClick={(event) => {
          event.stopPropagation();
          useExplorerStore.getState().selectPlot(plot.id);
        }}
      >
        <meshStandardMaterial
          map={statusTexture}
          color={STATUS_COLOR[plot.status]}
          roughness={0.92}
          metalness={0}
          transparent
          opacity={0.56}
          emissive={STATUS_COLOR[plot.status]}
          emissiveIntensity={0.04}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={frame} geometry={frameGeometry} position={[0, 0.12, 0]} castShadow={false}>
        <meshStandardMaterial color={FRAME_COLOR[plot.status]} roughness={0.7} transparent opacity={0.9} />
      </mesh>

      <sprite ref={labelRef} position={[0, 1.6, 0]} scale={[3.6, 1.35, 1]} visible={false}>
        <spriteMaterial map={labelTexture} transparent depthTest={false} depthWrite={false} />
      </sprite>
    </group>
  );
}

export default function Parcels({ onHover }: Props) {
  const plots = useExplorerStore((state) => state.plots);
  const filteredIds = useExplorerStore((state) => state.filteredIds);
  const selectedId = useExplorerStore((state) => state.selectedId);
  const hoveredId = useExplorerStore((state) => state.hoveredId);
  const labelsVisible = useExplorerStore((state) => state.labelsVisible);
  const [tick, setTick] = useState(0);

  const filtered = useMemo(() => new Set(filteredIds), [filteredIds]);

  return (
    <group onPointerMissed={() => useExplorerStore.getState().clearSelection()}>
      {plots.map((plot) => (
        <PlotParcel
          key={plot.id}
          plot={plot}
          dimmed={!filtered.has(plot.id)}
          selected={selectedId === plot.id}
          hovered={hoveredId === plot.id}
          onHover={(target, x, y) => {
            useExplorerStore.getState().setHovered(target?.id ?? null);
            onHover(target, x, y);
            if (target) setTick((value) => value + 1);
          }}
        />
      ))}
      {labelsVisible && (
        <group>
          {plots.map((plot) => (
            <sprite key={`label-${plot.id}`} position={[plot.x, 1.7, plot.z]} scale={[3.4, 1.28, 1]}>
              <spriteMaterial
                map={getLabelTexture(plot.id)}
                transparent
                depthTest={false}
                depthWrite={false}
                opacity={filtered.has(plot.id) ? 0.95 : 0.25}
              />
            </sprite>
          ))}
        </group>
      )}
    </group>
  );
}
