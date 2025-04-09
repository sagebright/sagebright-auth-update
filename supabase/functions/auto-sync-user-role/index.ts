
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Parse the request body
    const { userId } = await req.json() as AutoSyncUserRoleRequest;
    
    if (!userId) {
      console.error('No user ID provided in request');
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
      console.error('Invalid UUID format:', userId);
      return new Response(
        JSON.stringify({ error: 'Invalid UUID format for user ID' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`Auto-syncing role for user: ${userId}`);

    // Retrieve user role from the users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user data', details: userError }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    if (!userData) {
      console.error(`User not found with ID: ${userId}`);
      return new Response(
        JSON.stringify({ error: `User not found with ID: ${userId}` }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`Found user with role: ${userData.role}`);

    // Get current user metadata from auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError) {
      console.error('Error fetching auth user:', authError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch auth user data', details: authError }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    const currentRole = authUser?.user?.user_metadata?.role;
    console.log(`Current auth role: ${currentRole}, database role: ${userData.role}`);

    // Skip update if roles already match
    if (currentRole === userData.role) {
      console.log(`No update needed - roles already match: ${userData.role}`);
      return new Response(
        JSON.stringify({ 
          message: 'No update needed - roles already match', 
          userId, 
          role: userData.role 
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Update the user's metadata with the role from the database
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
      console.error('Error updating user metadata:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update user metadata', details: updateError }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log('Successfully updated user metadata with role:', userData.role);

    return new Response(
      JSON.stringify({
        message: 'User role synced automatically',
        userId,
        role: userData.role,
        previousRole: currentRole
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});
