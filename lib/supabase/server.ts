import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const hasServiceRoleKey = Boolean(serviceRoleKey);

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  (serviceRoleKey || anonKey) &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export function createServerClient() {
  if (!isServerSupabaseConfigured) return null;

  const keyToUse = serviceRoleKey || anonKey;

  if (!serviceRoleKey && process.env.NODE_ENV !== 'production') {
    console.warn(
      'PERINGATAN: SUPABASE_SERVICE_ROLE_KEY belum di-set di server. Menggunakan anon key fallback. Operasi tulis mungkin ditolak jika RLS dikunci.'
    );
  }

  return createClient(supabaseUrl, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
