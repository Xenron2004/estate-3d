import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase-server';
import { AMENITIES } from '@/lib/data/amenities';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length) {
        return NextResponse.json(
          { amenities: data, source: 'database' },
          { headers: { 'Cache-Control': 'no-store' } },
        );
      }
    }
  } catch (err) {
    console.error('[api/amenities] database read failed, serving canonical dataset:', err);
  }

  return NextResponse.json(
    { amenities: AMENITIES, source: 'canonical' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
