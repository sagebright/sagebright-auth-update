
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// Update the CORS headers to include the custom headers we use
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-manual-sync, x-request-id, x-fallback-sync, x-last-resort',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔍 Database trigger function called");
    
    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log("📊 Checking for users that need to be synchronized");
    
    // Get users from auth that don't have corresponding records in users table
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error("❌ Error fetching auth users:", authError);
      throw authError;
    }

    console.log(`✅ Found ${authUsers.users.length} users in auth system`);
    
    // For each auth user, check if they exist in the users table
    for (const authUser of authUsers.users) {
      console.log(`🔄 Processing user: ${authUser.id}`);
      
      // Check if user exists in users table
      const { data: existingUser, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();
        
      if (userError) {
        console.error(`❌ Error checking for existing user ${authUser.id}:`, userError);
        continue;
      }
      
      // If user doesn't exist in users table, create them
      if (!existingUser) {
        console.log(`➕ Creating new user record for ${authUser.id}`);
        
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Unknown',
            role: authUser.user_metadata?.role || 'user'
          });
          
        if (insertError) {
          console.error(`❌ Error creating user record for ${authUser.id}:`, insertError);
        } else {
          console.log(`✅ Successfully created user record for ${authUser.id}`);
          
          // Log the role sync
          await supabaseAdmin
            .from('role_sync_log')
            .insert({
              user_id: authUser.id,
              new_role: authUser.user_metadata?.role || 'user',
            });
        }
      } else {
        console.log(`ℹ️ User ${authUser.id} already exists in users table`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Processed ${authUsers.users.length} users`
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});
