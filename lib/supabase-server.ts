import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client.
 *
 * Prefers the service role key (server only). If the deployment has not been
 * provisioned with one it falls back to the publishable key so the demo keeps
 * working — the tables used here are public demo data.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const hasDatabase = Boolean(url && key);

export const supabase = hasDatabase
  ? createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export default supabase;
