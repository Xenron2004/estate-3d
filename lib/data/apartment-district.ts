/** Five new residences in a northern extension, beyond the existing 50-plot plan. */
export const DISTRICT_BOUNDS = { minX: -104, maxX: 104, minZ: 194, maxZ: 280 };

export const APARTMENT_FLOOR_HEIGHT = 3.2;

export interface ModernApartmentSpec {
  id: string;
  name: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  floors: number;
  /** Entry elevation: +1 faces north, -1 faces south. */
  front: 1 | -1;
}

export const MODERN_APARTMENTS: ModernApartmentSpec[] = [
  { id: 'residence-01', name: 'Cedar House', x: -68, z: 211, width: 34, depth: 22, floors: 7, front: 1 },
  { id: 'residence-02', name: 'Olive House', x: 68, z: 211, width: 34, depth: 22, floors: 8, front: 1 },
  { id: 'residence-03', name: 'Birch House', x: -68, z: 259, width: 34, depth: 22, floors: 9, front: -1 },
  { id: 'residence-04', name: 'Aspen House', x: 0, z: 259, width: 34, depth: 22, floors: 10, front: -1 },
  { id: 'residence-05', name: 'Willow House', x: 68, z: 259, width: 34, depth: 22, floors: 8, front: -1 },
];
