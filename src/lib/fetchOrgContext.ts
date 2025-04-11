
// src/lib/fetchOrgContext.ts

import { supabase } from '@/lib/supabaseClient';

/**
 * Fetches organizational context from the org_context table.
 * Enhanced to handle missing data gracefully.
 *
 * @param orgId - The organization ID tied to the user/session
 * @returns Object containing org-level configuration for Sage, or null if not found
 */
export async function fetchOrgContext(orgId: string) {
  if (!orgId) {
    console.warn("⚠️ Cannot fetch org context: No orgId provided");
    return null;
  }

  console.log("🔍 Fetching org context for orgId:", orgId);
  
  try {
    const { data, error } = await supabase
      .from('org_context')
      .select('*')
      .eq('id', orgId)
      .maybeSingle();  // Use maybeSingle instead of single to handle no data case

    if (error) {
      console.error('❌ Error fetching org_context:', error.message);
      return null;
    }

    if (!data) {
      console.warn(`⚠️ No org_context found for orgId: ${orgId}. This is expected during development.`);
      return null;
    }

    console.log("📦 Org context found:", data);
    return {
      orgId: orgId,
      name: data.name || "Default Organization",
      mission: data.mission || "",
      values: data.values || [],
      onboarding_processes: data.onboarding_processes || "",
      tools_and_systems: data.tools_and_systems || "",
      glossary: data.glossary || {},
      policies: data.policies || {},
      known_pain_points: data.known_pain_points || [],
      learning_culture: data.learning_culture || "",
      leadership_style: data.leadership_style || "",
      executives: data.executives || [],
      history: data.history || "",
      culture: data.culture || "",
    };
  } catch (err) {
    console.error('❌ Exception in fetchOrgContext:', err);
    return null;
  }
}
