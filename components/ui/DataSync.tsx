'use client';

import { useEffect } from 'react';
import { useExplorerStore } from '@/lib/store';

/**
 * Pulls live availability from the API route and mirrors it into the shared
 * store, so the 3D scene, the inventory and the filters all read the same
 * source. If the API is unreachable the canonical dataset stays in place.
 */
export default function DataSync() {
  const setPlots = useExplorerStore((state) => state.setPlots);
  const setDataStatus = useExplorerStore((state) => state.setDataStatus);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setDataStatus('loading');
      try {
        const response = await fetch('/api/plots', { cache: 'no-store' });
        if (!response.ok) throw new Error(`plots ${response.status}`);
        const data = await response.json();
        if (cancelled) return;
        if (Array.isArray(data?.plots) && data.plots.length) {
          setPlots(data.plots);
          setDataStatus('ready');
        } else {
          setDataStatus('ready');
        }
      } catch (error) {
        console.warn('[aurelia] falling back to the built-in dataset:', error);
        if (!cancelled) setDataStatus('error');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [setPlots, setDataStatus]);

  return null;
}
