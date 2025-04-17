
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uonxhnmvrtuszgjubvaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbnhobm12cnR1c3pnanVidmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzIzMTIsImV4cCI6MjA1NzE0ODMxMn0.yIJAmU3OLGXsZ5ar5L7kMo-CHL21FJWSnItbs7mOswo';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Missing Supabase configuration. Check project configuration.");
}

// Use a global singleton pattern (especially important in dev with HMR)
const globalAny = globalThis as any;

if (!globalAny.__supabase) {
  console.log("🧠 Initializing Supabase client at", new Date().toISOString());

  globalAny.__supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'sagebright_supabase_auth',
      storage: localStorage,
    },
  });
}

export const supabase = globalAny.__supabase;
// Dev-only: Expose supabase for debugging in the console
if (typeof window !== "undefined") {
  (window as any).supabase = supabase;
}

// Add a function to check if auth has been initialized
export const checkAuth = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Auth check failed:', error.message);
      return false;
    }
    return !!data.session;
  } catch (err) {
    console.error('❌ Unexpected auth error:', err);
    return false;
  }
};
