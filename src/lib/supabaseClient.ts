
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Use import.meta.env for Vite environment variables instead of process.env
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://uonxhnmvrtuszgjubvaa.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbnhobm12cnR1c3pnanVidmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzIzMTIsImV4cCI6MjA1NzE0ODMxMn0.yIJAmU3OLGXsZ5ar5L7kMo-CHL21FJWSnItbs7mOswo"
)
