import * as THREE from 'three';
import type { PlotStatus } from '../types';

/** Deterministic PRNG so every render of the scene is identical. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const parcelCache = new Map<string, THREE.BoxGeometry>();
const frameCache = new Map<string, THREE.ExtrudeGeometry>();
const statusTextureCache = new Map<PlotStatus, THREE.CanvasTexture>();
const labelCache = new Map<string, THREE.CanvasTexture>();

export function getParcelGeometry(width: number, depth: number): THREE.BoxGeometry {
  const key = `${width}x${depth}`;
  let geometry = parcelCache.get(key);
  if (!geometry) {
    geometry = new THREE.BoxGeometry(width, 0.22, depth);
    parcelCache.set(key, geometry);
  }
  return geometry;
}

/** Survey-style boundary frame drawn around every parcel. */
export function getParcelFrameGeometry(width: number, depth: number): THREE.ExtrudeGeometry {
  const key = `${width}x${depth}`;
  let geometry = frameCache.get(key);
  if (!geometry) {
    const bar = 0.42;
    const outer = new THREE.Shape();
    outer.moveTo(-width / 2, -depth / 2);
    outer.lineTo(width / 2, -depth / 2);
    outer.lineTo(width / 2, depth / 2);
    outer.lineTo(-width / 2, depth / 2);
    outer.closePath();

    const hole = new THREE.Path();
    hole.moveTo(-width / 2 + bar, -depth / 2 + bar);
    hole.lineTo(width / 2 - bar, -depth / 2 + bar);
    hole.lineTo(width / 2 - bar, depth / 2 - bar);
    hole.lineTo(-width / 2 + bar, depth / 2 - bar);
    hole.closePath();
    outer.holes.push(hole);

    geometry = new THREE.ExtrudeGeometry(outer, { depth: 0.26, bevelEnabled: false });
    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();
    frameCache.set(key, geometry);
  }
  return geometry;
}

/**
 * Status patterns double as non-colour cues: available is plain, booked is
 * diagonal, sold is cross-hatched.
 */
export function getStatusTexture(status: PlotStatus): THREE.CanvasTexture {
  const cached = statusTextureCache.get(status);
  if (cached) return cached;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(0,0,0,0.22)';
  ctx.lineWidth = 3;

  if (status === 'booked') {
    ctx.beginPath();
    for (let i = -size; i < size * 2; i += 18) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
    }
    ctx.stroke();
  } else if (status === 'sold') {
    ctx.beginPath();
    for (let i = -size; i < size * 2; i += 14) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.moveTo(i + size, 0);
      ctx.lineTo(i, size);
    }
    ctx.stroke();
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.13)';
    for (let x = 6; x < size; x += 16) {
      for (let y = 6; y < size; y += 16) {
        ctx.fillRect(x, y, 3, 3);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  statusTextureCache.set(status, texture);
  return texture;
}

/** Crisp canvas label rendered as a sprite in the 3D scene. */
export function getLabelTexture(text: string, tone: 'light' | 'dark' = 'light'): THREE.CanvasTexture {
  const key = `${tone}:${text}`;
  const cached = labelCache.get(key);
  if (cached) return cached;

  const width = 256;
  const height = 96;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, width, height);

  const bg = tone === 'light' ? 'rgba(250,247,239,0.94)' : 'rgba(20,28,24,0.9)';
  const fg = tone === 'light' ? '#1d2622' : '#f6f1e6';

  ctx.fillStyle = bg;
  const radius = 16;
  ctx.beginPath();
  ctx.moveTo(radius, 6);
  ctx.arcTo(width - 6, 6, width - 6, height - 6, radius);
  ctx.arcTo(width - 6, height - 6, 6, height - 6, radius);
  ctx.arcTo(6, height - 6, 6, 6, radius);
  ctx.arcTo(6, 6, width - 6, 6, radius);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = fg;
  ctx.font = '600 44px "Inter", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  labelCache.set(key, texture);
  return texture;
}

export function getSignTexture(title: string, subtitle: string): THREE.CanvasTexture {
  const key = `sign:${title}:${subtitle}`;
  const cached = labelCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1f2a24';
  ctx.fillRect(0, 0, 1024, 256);
  ctx.strokeStyle = '#b08d55';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, 1024 - 36, 256 - 36);
  ctx.fillStyle = '#f2ead9';
  ctx.font = '600 92px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText(title.toUpperCase(), 512, 124);
  ctx.fillStyle = '#b08d55';
  ctx.font = '400 40px Inter, Arial, sans-serif';
  ctx.fillText(subtitle, 512, 190);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  labelCache.set(key, texture);
  return texture;
}
