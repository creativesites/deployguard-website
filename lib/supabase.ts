import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — only initialised when first accessed (avoids build-time errors
// while env vars are not yet populated).
let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    _client = createClient(url, anon)
  }
  return _client
}

// Convenience re-export for client components — safe to use inside useEffect / event handlers.
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, k) => Reflect.get(getSupabaseClient(), k),
})

// Server-side admin client (service-role key, bypasses RLS).
// Only call inside API routes or Server Actions — never import into 'use client' files.
export function createAdminClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { persistSession: false } },
  )
}
