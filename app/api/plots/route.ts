import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase-server';
import { PLOTS } from '@/lib/data/township';
import type { Plot } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PlotRow {
  id: string;
  block: string;
  row_index: number;
  col_index: number;
  x: number;
  z: number;
  min_x: number;
  max_x: number;
  min_z: number;
  max_z: number;
  width: number;
  depth: number;
  area_sqm: number;
  area_sqft: number;
  facing: string;
  secondary_frontage: string | null;
  road_name: string;
  road_width_m: number;
  price: number;
  price_per_sqft: number;
  status: string;
  description: string;
  premium: string | null;
  distances: Plot['distances'];
  polygon: [number, number][];
}

function fromRow(row: PlotRow): Plot {
  return {
    id: row.id,
    block: row.block as 'A' | 'B',
    rowIndex: row.row_index,
    colIndex: row.col_index,
    x: row.x,
    z: row.z,
    minX: row.min_x,
    maxX: row.max_x,
    minZ: row.min_z,
    maxZ: row.max_z,
    width: row.width,
    depth: row.depth,
    areaSqm: row.area_sqm,
    areaSqft: row.area_sqft,
    facing: row.facing as Plot['facing'],
    secondaryFrontage: (row.secondary_frontage ?? null) as Plot['secondaryFrontage'],
    roadName: row.road_name,
    roadWidthM: row.road_width_m,
    price: row.price,
    pricePerSqft: row.price_per_sqft,
    status: row.status as Plot['status'],
    description: row.description,
    premium: row.premium,
    distances: row.distances,
    polygon: row.polygon,
  };
}

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('plots')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length) {
        return NextResponse.json(
          { plots: (data as unknown as PlotRow[]).map(fromRow), source: 'database' },
          { headers: { 'Cache-Control': 'no-store' } },
        );
      }
    }
  } catch (err) {
    console.error('[api/plots] database read failed, serving canonical dataset:', err);
  }

  return NextResponse.json(
    { plots: PLOTS, source: 'canonical' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
