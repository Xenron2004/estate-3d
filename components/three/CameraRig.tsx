'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useExplorerStore, type PanDirection } from '@/lib/store';
import { SITE, WALKTHROUGH_POINTS } from '@/lib/data/township';
import { setWalkT, walkRuntime } from '@/lib/walk-runtime';
import { APARTMENTS_VIEW_BOUNDS, CAMERA_PRESETS, TOWNSHIP_VIEW_BOUNDS, fitCameraPosition } from '@/lib/camera';
import { DISTRICT_BOUNDS } from '@/lib/data/apartment-district';

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Props {
  variant?: 'hero' | 'explorer';
  introDuration?: number;
}

export default function CameraRig({ variant = 'explorer', introDuration }: Props) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const aspect = size.width / Math.max(1, size.height);
  const controls = useThree((state) => state.controls) as
    | (THREE.EventDispatcher & { target: THREE.Vector3; update: () => void })
    | null;

  const desiredPosition = useRef(new THREE.Vector3(...CAMERA_PRESETS.home.position));
  const desiredTarget = useRef(new THREE.Vector3(...CAMERA_PRESETS.home.target));
  const transitioning = useRef(true);
  const lastRequestId = useRef(0);
  const lastPanRequestId = useRef(0);
  const introElapsed = useRef(0);
  const introActive = useRef(true);
  const reducedMotion = useRef(false);
  const lastWalkNotify = useRef(0);
  const driftOffset = useRef(new THREE.Vector3());
  const upAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const duration = introDuration ?? (variant === 'hero' ? 3 : 1.8);

  const walkCurve = useMemo(    () =>
      new THREE.CatmullRomCurve3(
        WALKTHROUGH_POINTS.map((point) => new THREE.Vector3(point[0], point[1], point[2])),
        true,
        'catmullrom',
        0.35,
      ),
    [],
  );

  const introPosition = useMemo(
    () =>
      new THREE.Vector3(
        ...(variant === 'hero' ? CAMERA_PRESETS.introHero.position : CAMERA_PRESETS.introExplorer.position),
      ),
    [variant],
  );
  const introTarget = useMemo(
    () =>
      new THREE.Vector3(
        ...(variant === 'hero' ? CAMERA_PRESETS.introHero.target : CAMERA_PRESETS.introExplorer.target),
      ),
    [variant],
  );
  const homePosition = useMemo(() => new THREE.Vector3(...fitCameraPosition(
    CAMERA_PRESETS.home.position, CAMERA_PRESETS.home.target, TOWNSHIP_VIEW_BOUNDS, aspect,
  )), [aspect]);
  const homeTarget = useMemo(() => new THREE.Vector3(...CAMERA_PRESETS.home.target), []);

  useEffect(() => {
    const { cameraMode, cameraRequest } = useExplorerStore.getState();
    if (cameraMode === 'walk') return;
    const preset = [CAMERA_PRESETS.home, CAMERA_PRESETS.apartments, CAMERA_PRESETS.plan].find((view) =>
      cameraRequest?.position.every((value, axis) => value === view.position[axis]),
    );
    if (!preset) return;
    desiredPosition.current.set(...fitCameraPosition(
      preset.position, preset.target, preset === CAMERA_PRESETS.apartments ? APARTMENTS_VIEW_BOUNDS : TOWNSHIP_VIEW_BOUNDS, aspect,
    ));
    desiredTarget.current.set(...preset.target);
    transitioning.current = true;
  }, [aspect]);

  useEffect(() => {
    camera.position.copy(introPosition);
    if (controls) {
      controls.target.copy(introTarget);
      controls.update();
    }
  }, [camera, controls, introPosition, introTarget]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedMotion.current = preference.matches;
      if (preference.matches && introActive.current) {
        introActive.current = false;
        camera.position.copy(homePosition);
        controls?.target.copy(homeTarget);
        controls?.update();
      }
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, [camera, controls, homePosition, homeTarget]);

  useFrame((state, delta) => {
    if (!controls) return;
    const store = useExplorerStore.getState();

    // A gallery capture needs the camera placed exactly, so it overrides both
    // the cinematic reveal and the damping.
    const capture = store.captureRequest;
    if (capture) {
      const view = capture.preset.camera;
      camera.position.set(...(capture.preset.id === 'apartments'
        ? fitCameraPosition(view.position, view.target, APARTMENTS_VIEW_BOUNDS, aspect)
        : view.position));
      controls.target.set(...capture.preset.camera.target);
      controls.update();
      return;
    }

    if (introActive.current) {
      introElapsed.current += delta;
      const t = Math.min(1, introElapsed.current / duration);
      const eased = easeInOutCubic(t);
      camera.position.lerpVectors(introPosition, homePosition, eased);
      camera.position.y += Math.sin(eased * Math.PI) * 34;
      controls.target.lerpVectors(introTarget, homeTarget, eased);
      controls.update();
      if (t >= 1) introActive.current = false;
      return;
    }

    const request = store.cameraRequest;
    if (request && request.id !== lastRequestId.current) {
      lastRequestId.current = request.id;
      if (store.cameraMode === 'walk') {
        walkRuntime.t = 0;
        setWalkT(0);
      } else {
        const preset = [CAMERA_PRESETS.home, CAMERA_PRESETS.apartments, CAMERA_PRESETS.plan].find((view) =>
          request.position.every((value, axis) => value === view.position[axis]),
        );
        desiredPosition.current.set(...(preset
          ? fitCameraPosition(request.position, request.target, preset === CAMERA_PRESETS.apartments ? APARTMENTS_VIEW_BOUNDS : TOWNSHIP_VIEW_BOUNDS, aspect)
          : request.position));
        desiredTarget.current.set(...request.target);
        transitioning.current = true;
      }
    }

    const panRequest = store.panRequest;
    if (
      variant === 'explorer' &&
      store.cameraMode !== 'walk' &&
      panRequest &&
      panRequest.id !== lastPanRequestId.current
    ) {
      lastPanRequestId.current = panRequest.id;
      const direction = new THREE.Vector3();
      if (panRequest.direction === 'up' || panRequest.direction === 'down') {
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
      } else {
        direction.set(1, 0, 0).applyQuaternion(camera.quaternion);
        direction.y = 0;
        direction.normalize();
      }

      const sign = panRequest.direction === 'up' || panRequest.direction === 'right' ? 1 : -1;
      direction.multiplyScalar(sign * 18);
      const nextX = THREE.MathUtils.clamp(
        controls.target.x + direction.x,
        SITE.minX - 70,
        SITE.maxX + 70,
      );
      const nextZ = THREE.MathUtils.clamp(
        controls.target.z + direction.z,
        SITE.minZ - 70,
        DISTRICT_BOUNDS.maxZ + 40,
      );
      const offset = new THREE.Vector3(nextX - controls.target.x, 0, nextZ - controls.target.z);

      camera.position.add(offset);
      controls.target.add(offset);
      desiredPosition.current.add(offset);
      desiredTarget.current.add(offset);
      controls.update();
    } else if (panRequest && panRequest.id !== lastPanRequestId.current && store.cameraMode === 'walk') {
      lastPanRequestId.current = panRequest.id;
    }

    if (store.cameraMode === 'walk') {
      if (walkRuntime.playing) {
        walkRuntime.t = (walkRuntime.t + delta * 0.0135) % 1;
        if (state.clock.elapsedTime - lastWalkNotify.current > 0.12) {
          lastWalkNotify.current = state.clock.elapsedTime;
          setWalkT(walkRuntime.t);
        }
      }
      const point = walkCurve.getPointAt(walkRuntime.t);
      const lookAhead = walkCurve.getPointAt((walkRuntime.t + 0.011) % 1);
      const follow = 1 - Math.pow(0.0006, delta);
      camera.position.lerp(point, follow);
      controls.target.lerp(lookAhead, follow);
      controls.update();
      return;
    }

    if (transitioning.current) {
      const k = reducedMotion.current ? 1 : 1 - Math.pow(0.0018, delta);
      camera.position.lerp(desiredPosition.current, k);
      controls.target.lerp(desiredTarget.current, k);
      if (
        camera.position.distanceTo(desiredPosition.current) < 0.6 &&
        controls.target.distanceTo(desiredTarget.current) < 0.6
      ) {
        transitioning.current = false;
      }
    } else if (variant === 'hero' && !reducedMotion.current) {
      // A slow, continuous drift keeps the hero frame alive without stealing
      // attention from the headline.
      driftOffset.current.copy(camera.position).sub(controls.target);
      driftOffset.current.applyAxisAngle(upAxis, delta * 0.028);
      camera.position.copy(controls.target).add(driftOffset.current);
    }

    // Keep the orbit target inside the development so the view can never be
    // lost in the surrounding terrain.
    const margin = 70;
    controls.target.x = THREE.MathUtils.clamp(
      controls.target.x,
      SITE.minX - margin,
      SITE.maxX + margin,
    );
    controls.target.z = THREE.MathUtils.clamp(
      controls.target.z,
      SITE.minZ - margin,
      DISTRICT_BOUNDS.maxZ + 40,
    );
    controls.update();
  });

  return null;
}
