'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useExplorerStore } from '@/lib/store';
import { LIGHTING } from '@/lib/three/lighting';
import SiteGround from './SiteGround';
import Roads3D from './Roads3D';
import Parcels from './Parcels';
import Structures from './Structures';
import Planting from './Planting';
import StreetFurniture from './StreetFurniture';
import AmenityHotspots from './AmenityHotspots';
import HousePreview from './HousePreview';
import CameraRig from './CameraRig';
import ApartmentSociety from './ApartmentSociety';
import type { Plot } from '@/lib/types';

function Exposure({ value }: { value: number }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = value;
  }, [gl, value]);
  return null;
}

export default function Scene({
  variant,
  quality,
  onHover,
}: {
  variant: 'hero' | 'explorer';
  quality: 'high' | 'low';
  onHover: (plot: Plot | null, x: number, y: number) => void;
}) {
  const timeOfDay = useExplorerStore((state) => state.timeOfDay);
  const lighting = LIGHTING[timeOfDay];

  const sunPosition = useMemo<[number, number, number]>(() => {
    const [x, y, z] = lighting.sunDirection;
    return [x * 320, y * 320, z * 320 + 96];
  }, [lighting]);

  const lightRef = useRef<THREE.DirectionalLight>(null);
  const lightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0, 96);
    return target;
  }, []);

  useEffect(() => {
    if (!lightRef.current) return;
    lightRef.current.target = lightTarget;
    lightRef.current.target.updateMatrixWorld();
  }, [lightTarget]);

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        turbidity={lighting.turbidity}
        rayleigh={lighting.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.82}
      />
      <fog attach="fog" args={[lighting.fog, lighting.fogNear, lighting.fogFar]} />
      <Exposure value={lighting.exposure} />

      <hemisphereLight args={[lighting.skyColor, lighting.groundColor, lighting.hemiIntensity]} />
      <primitive object={lightTarget} />
      <directionalLight
        ref={lightRef}
        position={sunPosition}
        color={lighting.sunColor}
        intensity={lighting.sunIntensity}
        castShadow={quality === 'high'}
        shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
        shadow-camera-near={1}
        shadow-camera-far={900}
        shadow-camera-left={-190}
        shadow-camera-right={190}
        shadow-camera-top={190}
        shadow-camera-bottom={-190}
        shadow-bias={-0.0006}
        shadow-normalBias={0.05}
      />

      <SiteGround quality={quality} />
      <Roads3D quality={quality} />
      <Parcels onHover={onHover} />
      <ApartmentSociety />
      <Structures quality={quality} />
      <Planting quality={quality} />
      <StreetFurniture quality={quality} timeOfDay={timeOfDay} />
      <AmenityHotspots />
      <HousePreview />
      <CameraRig variant={variant} />
    </>
  );
}
