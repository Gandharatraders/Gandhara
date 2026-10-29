import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not defined');
}

if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
}

if (!serviceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined, falling back to anon key');
}

// Client-side client (uses anon key, subject to RLS)
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Server-side client (uses service role key, bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl!,
  serviceRoleKey || supabaseAnonKey!
);
