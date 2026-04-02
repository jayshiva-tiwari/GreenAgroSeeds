import { createClient } from '@supabase/supabase-js';

// Server-only client — uses service role key to bypass RLS
// NEVER expose this client or key to the browser
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase admin credentials. Check SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
