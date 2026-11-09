import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-side Supabase client using public environment variables.
 * If credentials are not yet configured, returns null to allow graceful offline/sandbox mode.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
