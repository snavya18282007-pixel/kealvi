import { createClient } from "@supabase/supabase-js"

// Server-only Supabase client using the service role key.
// All event/question/poll access goes through server actions, so we bypass
// RLS here and enforce authorization with secret host tokens instead.
// The service role key is a password to the whole database — it lives here,
// on the server, and never ships to the browser.
export function createServiceClient() {
  return createClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
}

// Backwards-compatible singleton.
export const supabase = createServiceClient()
