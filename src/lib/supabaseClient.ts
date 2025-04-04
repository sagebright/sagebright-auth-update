import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.");
}

// Use a global singleton pattern (especially important in dev with HMR)
const globalAny = globalThis as any;

if (!globalAny.__supabase) {
  // Temp fix for supaBase bullshit in auth
  console.log("🧠 Initializing Supabase client at", new Date().toISOString());

  globalAny.__supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = globalAny.__supabase;
// Dev-only: Expose supabase for debugging in the console
if (typeof window !== "undefined") {
  (window as any).supabase = supabase;
}
