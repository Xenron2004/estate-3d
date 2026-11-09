'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '@/lib/three/assets';
import type { TimeOfDay } from '@/lib/types';

/** Local, generated sky reflections: no HDR download is needed to render the scene. */
export default function CinematicEnvironment({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const tones = timeOfDay === 'dusk'
      ? ['#354c79', '#8093b4', '#e5b296', '#6c7968']
      : timeOfDay === 'golden'
        ? ['#7399c0', '#c2d4dc', '#ffe3ba', '#80916a']
        : ['#5c95ce', '#b9d6ee', '#edf3ed', '#8e9c78'];
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, tones[0]);
    gradient.addColorStop(0.38, tones[1]);
    gradient.addColorStop(0.52, tones[2]);
    gradient.addColorStop(0.65, tones[3]);
    gradient.addColorStop(1, '#545d46');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    const random = mulberry32(1804);
    for (let i = 0; i < 24; i += 1) {
      const x = random() * 512;
      const y = 30 + random() * 66;
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, 38);
      cloud.addColorStop(0, 'rgba(255,248,231,0.35)');
      cloud.addColorStop(1, 'rgba(255,248,231,0)');
      ctx.fillStyle = cloud;
      ctx.fillRect(x - 38, y - 38, 76, 76);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    const generator = new THREE.PMREMGenerator(gl);
    const environment = generator.fromEquirectangular(texture);
    const previous = scene.environment;
    const previousIntensity = scene.environmentIntensity;
    scene.environment = environment.texture;
    scene.environmentIntensity = timeOfDay === 'dusk' ? 0.38 : 0.55;
    texture.dispose();
    generator.dispose();
    return () => {
      scene.environment = previous;
      scene.environmentIntensity = previousIntensity;
      environment.dispose();
    };
  }, [gl, scene, timeOfDay]);

  return null;
}
