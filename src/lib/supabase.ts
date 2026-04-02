import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.warn('⚠️ Supabase URL is not configured or is using a placeholder. Please update .env.local with your real project URL.');
}

if (!supabaseKey || supabaseKey.includes('your-actual-anon-key')) {
  console.warn('⚠️ Supabase Anon Key is not configured or is using a placeholder. Please update .env.local with your real project API key.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
