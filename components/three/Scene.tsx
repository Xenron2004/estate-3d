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
import BuiltHomes from './BuiltHomes';
import AnimatedLife from './AnimatedLife';
import CommunityPavilion from './CommunityPavilion';
import CinematicEnvironment from './CinematicEnvironment';
import ModernApartments from './ModernApartments';
import ApartmentDistrictGround from './ApartmentDistrictGround';
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
    return [x * 320, y * 320, z * 320 + 140];
  }, [lighting]);

  const lightRef = useRef<THREE.DirectionalLight>(null);
  const lightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0, 140);
    return target;
  }, []);

  useEffect(() => {
    if (!lightRef.current) return;
    lightRef.current.target = lightTarget;
    lightRef.current.target.updateMatrixWorld();
    lightRef.current.shadow.radius = 1.5;
  }, [lightTarget, quality]);

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        turbidity={lighting.turbidity}
        rayleigh={lighting.rayleigh}
        mieCoefficient={0.001}
        mieDirectionalG={0.75}
      />
      <Exposure value={lighting.exposure} />
      <CinematicEnvironment timeOfDay={timeOfDay} />

      <hemisphereLight args={[lighting.skyColor, lighting.groundColor, lighting.hemiIntensity]} />
      <ambientLight
        color={timeOfDay === 'dusk' ? '#aeb8cb' : lighting.skyColor}
        intensity={timeOfDay === 'dusk' ? 0.2 : 0.12}
      />
      <directionalLight position={[110, 70, 210]} color="#9fc8f0" intensity={timeOfDay === 'dusk' ? 0.3 : 0.45} />
      <primitive object={lightTarget} />
      <directionalLight
        ref={lightRef}
        position={sunPosition}
        color={lighting.sunColor}
        intensity={lighting.sunIntensity}
        castShadow={quality === 'high'}
        shadow-mapSize-width={quality === 'high' ? 4096 : 1024}
        shadow-mapSize-height={quality === 'high' ? 4096 : 1024}
        shadow-camera-near={1}
        shadow-camera-far={900}
        shadow-camera-left={-210}
        shadow-camera-right={210}
        shadow-camera-top={210}
        shadow-camera-bottom={-210}
        shadow-bias={-0.00015}
        shadow-normalBias={0.08}
      />

      <SiteGround quality={quality} />
      <ApartmentDistrictGround quality={quality} />
      <Roads3D quality={quality} />
      <Parcels onHover={onHover} />
      <ApartmentSociety quality={quality} />
      <ModernApartments quality={quality} />
      <BuiltHomes quality={quality} />
      <CommunityPavilion quality={quality} />
      <Structures quality={quality} />
      <Planting quality={quality} />
      <StreetFurniture quality={quality} timeOfDay={timeOfDay} />
      <AnimatedLife quality={quality} />
      <AmenityHotspots />
      <HousePreview />
      <CameraRig variant={variant} />
    </>
  );
}
