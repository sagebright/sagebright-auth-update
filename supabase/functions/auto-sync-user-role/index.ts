
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// Update the CORS headers to include the custom headers we use
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-manual-sync, x-request-id, x-fallback-sync, x-last-resort',
};

interface AutoSyncUserRoleRequest {
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Enhanced logging for function invocation
    const isManualSync = req.headers.get('x-manual-sync') === 'true';
    const requestId = req.headers.get('x-request-id') || 'unknown';
    console.log(`🔄 Auto-sync user role function invoked. Manual sync: ${isManualSync}, Request ID: ${requestId}`);
    
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

    // Parse the request body with enhanced error handling
    let body;
    try {
      body = await req.json();
      console.log(`📦 Request body for ${requestId}:`, JSON.stringify(body));
    } catch (parseError) {
      console.error(`❌ Failed to parse request body for ${requestId}:`, parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
    
    const { userId } = body as AutoSyncUserRoleRequest;
    
    if (!userId) {
      console.error(`❌ No user ID provided in request ${requestId}`);
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Validate the UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(userId)) {
      console.error(`❌ Invalid UUID format for ${requestId}:`, userId);
      return new Response(
        JSON.stringify({ error: 'Invalid UUID format for user ID' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`🔄 Auto-syncing role for user: ${userId} (Request: ${requestId})`);

    // Retrieve user role from the users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      console.error(`❌ Error fetching user data for ${requestId}:`, userError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user data', details: userError }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    if (!userData) {
      console.error(`❌ User not found with ID: ${userId} (Request: ${requestId})`);
      return new Response(
        JSON.stringify({ error: `User not found with ID: ${userId}` }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`✅ Found user with role: ${userData.role} (Request: ${requestId})`);

    // Get current user metadata from auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError) {
      console.error(`❌ Error fetching auth user for ${requestId}:`, authError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch auth user data', details: authError }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    const currentRole = authUser?.user?.user_metadata?.role;
    console.log(`ℹ️ Current auth role: ${currentRole}, database role: ${userData.role} (Request: ${requestId})`);

    // Skip update if roles already match
    if (currentRole === userData.role) {
      console.log(`ℹ️ No update needed - roles already match: ${userData.role} (Request: ${requestId})`);
      return new Response(
        JSON.stringify({ 
          message: 'No update needed - roles already match', 
          userId, 
          role: userData.role,
          requestId
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Update the user's metadata with the role from the database
    console.log(`🔄 Updating auth metadata role from '${currentRole}' to '${userData.role}' (Request: ${requestId})`);
    
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: { 
          ...authUser?.user?.user_metadata,
          role: userData.role 
        } 
      }
    );

    if (updateError) {
      console.error(`❌ Error updating user metadata for ${requestId}:`, updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update user metadata', details: updateError }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`✅ Successfully updated user metadata with role: ${userData.role} (Request: ${requestId})`);

    return new Response(
      JSON.stringify({
        message: 'User role synced successfully',
        userId,
        role: userData.role,
        previousRole: currentRole,
        requestId
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
