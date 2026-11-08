/**
 * Seeds the canonical township dataset into Supabase.
 *
 * Run with:  npm run seed
 *
 * The dataset in lib/data is the single source of truth for the site, so the
 * database mirrors it exactly — same geometry, same areas, same prices.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { PLOTS } from '../lib/data/township';
import { AMENITIES } from '../lib/data/amenities';

function loadEnv() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  try {
    const content = readFileSync(new URL('../.env', import.meta.url), 'utf8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const value = match[2].replace(/^["']|["']$/g, '');
      if (!process.env[match[1]]) process.env[match[1]] = value;
    }
  } catch {
    console.warn('[seed] .env not found — relying on the ambient environment.');
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('[seed] Missing NEXT_PUBLIC_SUPABASE_URL / anon key.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const plotRows = PLOTS.map((plot) => ({
  id: plot.id,
  block: plot.block,
  row_index: plot.rowIndex,
  col_index: plot.colIndex,
  x: plot.x,
  z: plot.z,
  min_x: plot.minX,
  max_x: plot.maxX,
  min_z: plot.minZ,
  max_z: plot.maxZ,
  width: plot.width,
  depth: plot.depth,
  area_sqm: plot.areaSqm,
  area_sqft: plot.areaSqft,
  facing: plot.facing,
  secondary_frontage: plot.secondaryFrontage,
  road_name: plot.roadName,
  road_width_m: plot.roadWidthM,
  price: plot.price,
  price_per_sqft: plot.pricePerSqft,
  status: plot.status,
  description: plot.description,
  premium: plot.premium,
  distances: plot.distances,
  polygon: plot.polygon,
  updated_at: new Date().toISOString(),
}));

const amenityRows = AMENITIES.map((amenity) => ({
  id: amenity.id,
  name: amenity.name,
  category: amenity.category,
  x: amenity.x,
  z: amenity.z,
  summary: amenity.summary,
  detail: amenity.detail,
  camera: amenity.camera,
  facts: amenity.facts,
}));

async function main() {
  console.log(`[seed] upserting ${plotRows.length} plots…`);
  const { error: plotError } = await supabase.from('plots').upsert(plotRows, { onConflict: 'id' });
  if (plotError) {
    console.error('[seed] plots failed:', plotError.message);
  } else {
    console.log('[seed] plots OK');
  }

  console.log(`[seed] upserting ${amenityRows.length} amenities…`);
  const { error: amenityError } = await supabase.from('amenities').upsert(amenityRows, { onConflict: 'id' });
  if (amenityError) {
    console.error('[seed] amenities failed:', amenityError.message);
  } else {
    console.log('[seed] amenities OK');
  }

  const { count } = await supabase.from('plots').select('*', { count: 'exact', head: true });
  console.log(`[seed] plots table now holds ${count ?? 0} rows`);
}

main().catch((error) => {
  console.error('[seed] unexpected failure:', error);
  process.exit(1);
});
