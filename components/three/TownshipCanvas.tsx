'use client';

import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import Scene from './Scene';
import { useExplorerStore } from '@/lib/store';
import type { Plot } from '@/lib/types';

class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/** Grabs the rendered frame once the camera has settled on a gallery preset. */
function CaptureAgent() {
  const gl = useThree((state) => state.gl);
  const frames = useRef(0);
  const request = useExplorerStore((state) => state.captureRequest);

  useFrame(() => {
    if (!request) {
      frames.current = 0;
      return;
    }
    frames.current += 1;
    if (frames.current === 12) {
      const store = useExplorerStore.getState();
      window.setTimeout(() => {
        try {
          const url = gl.domElement.toDataURL('image/jpeg', 0.88);
          store.setCapture(request.preset.id, url);
        } catch (error) {
          console.warn('[aurelia] scene capture failed', error);
        }
        store.clearCaptureRequest();
      }, 140);
    }
  });

  return null;
}

interface Props {
  variant: 'hero' | 'explorer';
  quality: 'high' | 'low';
  className?: string;
}

export default function TownshipCanvas({ variant, quality, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dpr, setDpr] = useState(1.35);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [tooltip, setTooltip] = useState<{ plot: Plot; x: number; y: number } | null>(null);
  const captureRequest = useExplorerStore((state) => state.captureRequest);
  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      setSupported(Boolean(context));
    } catch {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: '160px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!captureRequest) return;
    setForceRender(true);
  }, [captureRequest]);

  // Switching a paused canvas back to "always" needs an explicit invalidate,
  // otherwise the shared render loop stays parked and the scene never draws.
  useEffect(() => {
    if (visible || forceRender) invalidate();
  }, [visible, forceRender]);

  useEffect(() => {
    if (!captureRequest && forceRender) {
      const timer = window.setTimeout(() => setForceRender(false), 400);
      return () => window.clearTimeout(timer);
    }
  }, [captureRequest, forceRender]);

  // The explorer owns the wheel so zoom never fights the page scroll. On
  // touch devices the wheel does not exist, so the page keeps scrolling.
  useEffect(() => {
    if (variant !== 'explorer') return;
    const element = hostRef.current;
    if (!element) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const handler = (event: WheelEvent) => {
      event.preventDefault();
    };
    element.addEventListener('wheel', handler, { passive: false });
    return () => element.removeEventListener('wheel', handler);
  }, [variant]);

  const handleHover = useCallback((plot: Plot | null, x: number, y: number) => {
    setTooltip(plot ? { plot, x, y } : null);
  }, []);

  if (supported === false) {
    return (
      <div
        ref={hostRef}
        className={`${className ?? ''} flex items-center justify-center bg-bone-deep/70 p-6 text-center`}
      >
        <p className="max-w-[40ch] text-[13px] leading-relaxed text-ink/60">
          This browser cannot open a WebGL context, so the live model is unavailable. Every parcel is
          still listed below with its exact dimensions, price and frontage, and the enquiry form works
          exactly as it does with the model on.
        </p>
      </div>
    );
  }

  const tooltipStyle = tooltip
    ? {
        left: Math.min(tooltip.x + 16, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 220),
        top: Math.max(tooltip.y - 18, 12),
      }
    : undefined;

  return (
    <div ref={hostRef} className={className} data-webgl={supported ? 'ready' : 'loading'}>
      {supported === null ? null : (
      <WebGLBoundary
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-bone-deep/70 p-6 text-center">
            <p className="max-w-[40ch] text-[13px] leading-relaxed text-ink/60">
              The 3D model could not start in this browser. The full plot inventory and the enquiry
              form are available below.
            </p>
          </div>
        }
      >
      <Canvas
        shadows={quality === 'high'}
        dpr={dpr}
        frameloop={visible || forceRender ? 'always' : 'never'}
        camera={{ position: [82, 88, 272], fov: 42, near: 0.5, far: 4200 }}
        gl={{
          antialias: quality === 'high',
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.02;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <PerformanceMonitor
          bounds={(rate) => (rate > 0.9 ? [50, 90] : [20, 60])}
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr((value) => Math.min(1.8, value + 0.2))}
          flipflops={3}
        />
        <Scene variant={variant} quality={quality} onHover={handleHover} />
        {variant === 'explorer' && <CaptureAgent />}
        <OrbitControls
          makeDefault
          enabled={variant === 'explorer'}
          enableDamping
          dampingFactor={0.075}
          rotateSpeed={0.55}
          zoomSpeed={0.8}
          panSpeed={0.6}
          minDistance={14}
          maxDistance={460}
          minPolarAngle={0.05}
          maxPolarAngle={1.47}
          target={[0, 0, 96]}
        />
      </Canvas>
      </WebGLBoundary>
      )}

      {tooltip && (
        <div
          className="pointer-events-none fixed z-40 w-52 rounded-sm border border-ink/15 bg-bone/95 px-3 py-2 text-[11px] leading-tight text-ink shadow-[0_12px_30px_-18px_rgba(18,28,22,0.7)] backdrop-blur-sm"
          style={tooltipStyle}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-[12px] tracking-wider text-ink">{tooltip.plot.id}</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink/55">
              {tooltip.plot.status}
            </span>
          </div>
          <div className="mt-1 text-ink/70">
            {tooltip.plot.areaSqft.toLocaleString('en-IN')} sq ft · {tooltip.plot.facing}-facing
          </div>
        </div>
      )}
    </div>
  );
}
