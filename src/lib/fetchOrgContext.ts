// src/lib/fetchOrgContext.ts

import { supabase } from '@/lib/supabaseClient';

/**
 * Fetches organizational context from the org_context table.
 *
 * @param orgId - The organization ID tied to the user/session
 * @returns Object containing org-level configuration for Sage
 */
export async function fetchOrgContext(orgId: string) {
  const { data, error } = await supabase
    .from('org_context')
    .select('*')
    .eq('org_id', orgId)
    .single();

  if (error || !data) {
    console.error('❌ Failed to fetch org_context for org:', orgId, error);
    return null;
  }

  return {
    orgId: orgId,
    name: data.name,
    mission: data.mission,
    values: data.values || [],
    onboarding_processes: data.onboarding_processes,
    tools_and_systems: data.tools_and_systems,
    glossary: data.glossary || {},
    policies: data.policies || {},
    known_pain_points: data.known_pain_points || [],
    learning_culture: data.learning_culture,
    leadership_style: data.leadership_style,
    executives: data.executives || [],
    history: data.history,
    culture: data.culture,
  };
}