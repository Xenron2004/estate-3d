import type { Amenity, GalleryPreset } from '../types';
import { MASTER_PLAN_STATS } from './township';

export const AMENITIES: Amenity[] = [
  {
    id: 'entrance',
    name: 'Gated Main Entrance',
    category: 'landmark',
    x: 0,
    z: 8,
    summary: 'One controlled entry point from the 60 ft connect, with a guard cabin and boom barrier.',
    detail:
      'The township opens onto the 60 ft connective road at a single controlled entry. A guard cabin, a boom barrier, a paved plaza and a lit signboard sit within the gate, with the internal 30 ft Avenue beginning immediately behind it.',
    camera: { position: [26, 17, 46], target: [0, 2, 12] },
    facts: [
      { label: 'Entry width', value: '9.14 m (30 ft)' },
      { label: 'Gate controls', value: 'Guard cabin + boom barrier' },
      { label: 'Connective road', value: '18.29 m (60 ft)' },
    ],
  },
  {
    id: 'clubhouse',
    name: 'Aurelia Clubhouse',
    category: 'landmark',
    x: 0,
    z: 52,
    summary: 'A modest single-storey clubhouse with a shaded terrace and a residents’ car park.',
    detail:
      'Roughly 640 m² of built footprint set beside the Avenue: a multipurpose hall, a shaded veranda facing the green, a paved forecourt and marked parking bays. Deliberately low-rise so it never competes with the plots around it.',
    camera: { position: [36, 19, 86], target: [0, 3, 52] },
    facts: [
      { label: 'Footprint', value: '640 m²' },
      { label: 'Storeys', value: 'Single' },
      { label: 'Parking bays', value: '16 marked bays' },
    ],
  },
  {
    id: 'park',
    name: 'Central Park',
    category: 'green',
    x: 0,
    z: 150,
    summary: 'The landscaped heart of the township, with a walking loop, tree avenue and shaded seating.',
    detail:
      'A broad green running north–south through the middle of the master plan. It holds a looping walking path, an avenue of mature trees, a small gazebo, benches and lamp posts, and separates the two residential blocks from one another.',
    camera: { position: [54, 30, 214], target: [0, 0, 150] },
    facts: [
      { label: 'Area', value: `${MASTER_PLAN_STATS.parkAreaSqm.toLocaleString('en-IN')} m²` },
      { label: 'Open space', value: `${MASTER_PLAN_STATS.openSpacePercent}% of the site` },
      { label: 'Circulation', value: '1.8 m walking loop' },
    ],
  },
  {
    id: 'play',
    name: 'Children’s Play Court',
    category: 'leisure',
    x: 0,
    z: 94,
    summary: 'A fenced play court with soft-surface play, swings and an open lawn for informal games.',
    detail:
      'Set on the green between the park and the clubhouse: a soft-surface play area, a swing frame, a shaded sandpit and an open lawn that doubles as an informal cricket and football area. Fenced on three sides, open to the green on the fourth.',
    camera: { position: [40, 17, 128], target: [0, 2, 96] },
    facts: [
      { label: 'Area', value: `${MASTER_PLAN_STATS.playAreaSqm.toLocaleString('en-IN')} m²` },
      { label: 'Surface', value: 'Soft play + sandpit' },
      { label: 'Lighting', value: '4 lamp posts' },
    ],
  },
  {
    id: 'greenbelt',
    name: 'Green Belt & Walkway',
    category: 'green',
    x: -20,
    z: 74,
    summary: 'Mature planting and a shaded walkway running the length of both blocks.',
    detail:
      'A planted strip separates each residential block from the central green. Street trees, shrubs and a 1.8 m walkway make the walk from any plot to the park a shaded one, and keep the back-to-back plots acoustically separated.',
    camera: { position: [-64, 15, 122], target: [-20, 1, 78] },
    facts: [
      { label: 'Strip width', value: '31.8 m' },
      { label: 'Walkway', value: '1.8 m paved' },
      { label: 'Planting', value: 'Street trees + hedges' },
    ],
  },
  {
    id: 'avenue',
    name: 'Avenue · 30 ft Internal Road',
    category: 'infrastructure',
    x: -66,
    z: 30,
    summary: 'The internal distributor road: kerbs, footpaths, drainage and lighting already planned.',
    detail:
      'Every plot in the development fronts a 30 ft internal road. The Avenue runs east–west behind the entrance, with a kerbed carriageway, a pedestrian footpath on both sides, a covered stormwater channel and regular street lighting.',
    camera: { position: [-92, 13, 66], target: [-58, 1.5, 30] },
    facts: [
      { label: 'Carriageway', value: '9.14 m (30 ft)' },
      { label: 'Footpath', value: '1.6 m each side' },
      { label: 'Drainage', value: 'Covered stormwater channel' },
    ],
  },
  {
    id: 'connect',
    name: '60 ft Connective Road',
    category: 'infrastructure',
    x: 0,
    z: -4,
    summary: 'The arterial the township fronts — the route that puts the site on the wider network.',
    detail:
      'An 18.29 m (60 ft) arterial runs past the southern boundary, with a central divider, edge lines and street lighting. The gated entrance is the only vehicular interface with it.',
    camera: { position: [52, 16, -48], target: [0, 2, -4] },
    facts: [
      { label: 'Carriageway', value: '18.29 m (60 ft)' },
      { label: 'Access', value: 'Single gated entry' },
      { label: 'Lighting', value: 'Street lighting at 30 m' },
    ],
  },
  {
    id: 'boundary',
    name: 'Boundary Wall & Stormwater',
    category: 'infrastructure',
    x: -112,
    z: 100,
    summary: 'A secured compound wall with piers, and drainage that falls away from the plots.',
    detail:
      'The site is enclosed by a 1.9 m compound wall with piers and a coping, broken only by the gate. Surface water is carried in a covered channel along the road edges into a detention area at the north-east corner.',
    camera: { position: [-150, 22, 96], target: [-108, 2, 100] },
    facts: [
      { label: 'Wall height', value: '1.9 m' },
      { label: 'Piers', value: 'Every 6 m' },
      { label: 'Drainage', value: 'Covered channel + detention' },
    ],
  },
];

export const AMENITY_BY_ID: Record<string, Amenity> = Object.fromEntries(
  AMENITIES.map((amenity) => [amenity.id, amenity]),
);

export const GALLERY_PRESETS: GalleryPreset[] = [
  {
    id: 'aerial',
    title: 'Aurelia from the air',
    caption: 'The full 50-plot master plan, entrance to northern park.',
    camera: { position: [78, 128, 312], target: [0, 0, 96] },
    timeOfDay: 'day',
  },
  {
    id: 'entrance',
    title: 'The gate',
    caption: 'Guard cabin, boom barrier and the first view down the Avenue.',
    camera: { position: [23, 9, 36], target: [0, 2.5, 10] },
    timeOfDay: 'day',
  },
  {
    id: 'avenue',
    title: 'Avenue frontage',
    caption: '30 ft carriageway, kerb, footpath and the west link road.',
    camera: { position: [-88, 8, 50], target: [-40, 1.5, 30] },
    timeOfDay: 'day',
  },
  {
    id: 'park',
    title: 'Central park',
    caption: 'The landscaped green that separates and connects both blocks.',
    camera: { position: [-42, 21, 116], target: [0, 0, 152] },
    timeOfDay: 'day',
  },
  {
    id: 'parcel',
    title: 'A single parcel',
    caption: 'Plot A-05 — green belt frontage on the Avenue.',
    camera: { position: [-38, 26, 44], target: [-43, 1, 48] },
    timeOfDay: 'day',
  },
  {
    id: 'golden',
    title: 'Golden hour',
    caption: 'The same township at low sun, from the northern edge of the park.',
    camera: { position: [-118, 22, 226], target: [0, 2, 118] },
    timeOfDay: 'golden',
  },
];
