import { GREEN, PLOTS, ROADS, SITE } from '@/lib/data/township';

const BOUNDS = { minX: -125, maxX: 125, minZ: -4, maxZ: 198 };
const W = BOUNDS.maxX - BOUNDS.minX;
const H = BOUNDS.maxZ - BOUNDS.minZ;

const X = (x: number) => x - BOUNDS.minX;
const Y = (z: number) => BOUNDS.maxZ - z;

const STATUS_FILL: Record<string, string> = {
  available: '#4f7f52',
  booked: '#b9822c',
  sold: '#9c4a3c',
};

/**
 * A drawn, purely 2D reading of the same master plan that drives the 3D
 * scene. Used as the loading state and as the no-WebGL fallback.
 */
export default function PlanPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="Schematic master plan of Aurelia Estates showing fifty parcels, internal roads and a central park"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect x={0} y={0} width={W} height={H} fill="#c8bda4" />
      <rect
        x={X(GREEN.parkMinX)}
        y={Y(GREEN.parkMaxZ)}
        width={GREEN.parkMaxX - GREEN.parkMinX}
        height={GREEN.parkMaxZ - GREEN.parkMinZ}
        fill="#8b9c68"
      />
      <rect
        x={X(GREEN.beltMinX)}
        y={Y(GREEN.beltMaxZ)}
        width={GREEN.beltMaxX - GREEN.beltMinX}
        height={GREEN.beltMaxZ - GREEN.beltMinZ}
        fill="#8b9c68"
      />
      <rect
        x={X(-26)}
        y={Y(GREEN.playMaxZ)}
        width={52}
        height={GREEN.playMaxZ - GREEN.playMinZ}
        fill="#d8c69c"
      />

      {Object.values(ROADS).map((road) => {
        const isX = road.axis === 'x';
        return (
          <rect
            key={road.id}
            x={isX ? X(road.from) : X(road.center - road.width / 2)}
            y={isX ? Y(road.center + road.width / 2) : Y(road.to)}
            width={isX ? road.to - road.from : road.width}
            height={isX ? road.width : road.to - road.from}
            fill="#3c3c39"
          />
        );
      })}

      {PLOTS.map((plot) => (
        <rect
          key={plot.id}
          x={X(plot.minX)}
          y={Y(plot.maxZ)}
          width={plot.width}
          height={plot.depth}
          fill={STATUS_FILL[plot.status]}
          fillOpacity={plot.status === 'available' ? 0.92 : 0.75}
          stroke="#f5f0e7"
          strokeWidth={0.35}
        />
      ))}

      <rect
        x={X(SITE.minX)}
        y={Y(SITE.maxZ)}
        width={SITE.maxX - SITE.minX}
        height={SITE.maxZ - SITE.minZ}
        fill="none"
        stroke="#2c3930"
        strokeWidth={1}
      />
    </svg>
  );
}
