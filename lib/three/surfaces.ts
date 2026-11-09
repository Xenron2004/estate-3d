import * as THREE from 'three';
import { mulberry32 } from './assets';

export type SurfaceKind = 'grass' | 'soil' | 'asphalt' | 'stone';

/** Small, local, tileable surfaces: no asset downloads or texture pop-in. */
export function createSurfaceTexture(kind: SurfaceKind, repeatX = 1, repeatY = repeatX) {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const random = mulberry32({ grass: 721, soil: 514, asphalt: 236, stone: 911 }[kind]);
  const palettes: Record<SurfaceKind, string[]> = {
    grass: ['#749350', '#809b58', '#648747', '#95a96b', '#54783e'],
    soil: ['#bdad8b', '#c7b897', '#b09e7b', '#d2c3a3', '#9f8e6d'],
    asphalt: ['#4c5051', '#565957', '#434949', '#62635f', '#383f40'],
    stone: ['#c8c2b2', '#d6d0bf', '#b9b3a4', '#ded7c7', '#aaa596'],
  };
  const tones = palettes[kind];
  ctx.fillStyle = tones[0];
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 300; i += 1) {
    const x = random() * size;
    const y = random() * size;
    const radius = 2 + random() * 17;
    const tone = tones[Math.floor(random() * tones.length)];
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        const gradient = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, radius);
        gradient.addColorStop(0, `${tone}60`);
        gradient.addColorStop(1, `${tones[0]}00`);
        ctx.fillStyle = gradient;
        ctx.fillRect(x + dx - radius, y + dy - radius, radius * 2, radius * 2);
      }
    }
  }
  for (let i = 0; i < 15000; i += 1) {
    const x = random() * size;
    const y = random() * size;
    ctx.globalAlpha = 0.15 + random() * 0.36;
    ctx.fillStyle = tones[Math.floor(random() * tones.length)];
    if (kind === 'grass') {
      ctx.fillRect(x, y, 0.5 + random() * 0.6, 1 + random() * 3);
    } else {
      const grain = 0.4 + random() * 1.4;
      ctx.fillRect(x, y, grain, grain);
    }
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = 8;
  return texture;
}
