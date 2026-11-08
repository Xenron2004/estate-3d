export type PlotStatus = 'available' | 'booked' | 'sold';

export type Facing = 'north' | 'south' | 'east' | 'west';

export type CameraMode = 'aerial' | 'orbit' | 'plan' | 'walk';

export type HouseStyle = 'none' | 'single' | 'double';

export type TimeOfDay = 'day' | 'golden' | 'dusk';

export interface PlotDistances {
  park: number;
  play: number;
  club: number;
  entrance: number;
}

export interface Plot {
  id: string;
  block: 'A' | 'B';
  rowIndex: number;
  colIndex: number;
  /** centroid in world metres (x = east, z = north) */
  x: number;
  z: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** frontage along the fronting road, metres */
  width: number;
  /** depth away from the fronting road, metres */
  depth: number;
  areaSqm: number;
  areaSqft: number;
  facing: Facing;
  secondaryFrontage: Facing | null;
  roadName: string;
  roadWidthM: number;
  price: number;
  pricePerSqft: number;
  status: PlotStatus;
  description: string;
  premium: string | null;
  distances: PlotDistances;
  polygon: [number, number][];
}

export interface RoadSpec {
  id: string;
  label: string;
  shortLabel: string;
  width: number;
  axis: 'x' | 'z';
  center: number;
  from: number;
  to: number;
  grade: 'arterial' | 'internal';
}

export interface Amenity {
  id: string;
  name: string;
  category: 'landmark' | 'green' | 'leisure' | 'infrastructure';
  x: number;
  z: number;
  summary: string;
  detail: string;
  camera: { position: [number, number, number]; target: [number, number, number] };
  facts: { label: string; value: string }[];
}

export interface GalleryPreset {
  id: string;
  title: string;
  caption: string;
  camera: { position: [number, number, number]; target: [number, number, number] };
  timeOfDay: TimeOfDay;
}
