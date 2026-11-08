/**
 * Mutable runtime state for the street-level walkthrough.
 *
 * Kept outside React so the camera can advance every frame without causing a
 * single re-render; the UI subscribes at a throttled rate.
 */
export const walkRuntime = {
  t: 0,
  playing: false,
};

type Listener = (t: number) => void;

const listeners = new Set<Listener>();

export function setWalkT(t: number) {
  walkRuntime.t = t;
  listeners.forEach((listener) => listener(t));
}

export function subscribeWalk(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
