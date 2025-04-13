
// src/lib/buildSageContext.ts

import { fetchOrgContext } from '@/lib/fetchOrgContext';
import { fetchUserContext } from '@/lib/fetchUserContext';
import { validateContextIds, validateOrgContext, validateUserContext } from '@/lib/contextValidation';
import { createOrgContextFallback, logContextBuildingError } from '@/lib/contextErrorHandling';

/**
 * Dev fallback context for testing without Supabase
 */
const DEV_ORG_CONTEXT = {
  orgId: "00000000-0000-0000-0000-000000000000",
  name: "Riverbend Solar",
  mission: "Accelerate clean energy adoption through innovative financing and technology solutions",
  values: ["Sustainability", "Innovation", "Customer-first", "Transparency"],
  onboarding_processes: "Mentorship program, department rotation, weekly check-ins",
  tools_and_systems: "Salesforce, HubSpot, Asana, Slack, Google Workspace",
  glossary: {
    "PPA": "Power Purchase Agreement",
    "ITC": "Investment Tax Credit",
    "LCOE": "Levelized Cost of Energy"
  },
  policies: {
    "Remote Work": "Hybrid schedule with 2 days in office required",
    "PTO": "Unlimited with minimum 20 days encouraged"
  },
  known_pain_points: ["Complex approval workflows", "Slow document processing"],
  learning_culture: "Quarterly learning budgets and monthly knowledge sharing sessions",
  leadership_style: "Collaborative with clear decision ownership",
  executives: [
    { name: "Maya Johnson", title: "CEO", background: "Former Tesla Energy executive" },
    { name: "David Chen", title: "CTO", background: "Previously led engineering at Sunrun" }
  ],
  history: "Founded in 2019 to simplify residential solar financing and installation",
  culture: "Fast-paced, impact-driven culture with emphasis on work-life balance",
};

const DEV_USER_CONTEXT = {
  user_id: "00000000-0000-0000-0000-000000000000",
  org_id: "00000000-0000-0000-0000-000000000000",
  start_date: "2023-01-15",
  goals: {
    "30 day": "Complete product training and shadow 3 customer calls",
    "60 day": "Develop first partnership proposal",
    "90 day": "Successfully close first strategic partnership"
  },
  personality_notes: "Detail-oriented, prefers comprehensive information",
  role: "Director of Strategic Partnerships",
  department: "Sales",
  manager_name: "Maya Johnson",
  location: "San Francisco Bay Area",
  timezone: "PST",
  working_hours: "9am-5pm PST",
  learning_style: "Visual and hands-on",
  introvert_extrovert: "Ambivert"
};

/**
 * Constructs the full context for Sage based on the user and org.
 *
 * @param userId - ID of the current user
 * @param orgId - ID of the user's organization
 * @returns Enriched context object Sage will use
 */
export async function buildSageContext(userId: string, orgId: string) {
  console.log("🔍 Building context for userId:", userId, "and orgId:", orgId);
  
  try {
    // Validate input parameters
    validateContextIds(userId, orgId);

    // Fetch context data
    const [orgContext, userContext] = await Promise.all([
      fetchOrgContext(orgId),
      fetchUserContext(userId),
    ]);

    console.log("✅ Context fetched:", { 
      orgContextExists: !!orgContext, 
      userContextExists: !!userContext 
    });

    // Apply development fallbacks if needed
    let finalOrgContext = orgContext;
    let finalUserContext = userContext;

    // Use development fallbacks if context is missing and in development mode
    const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
    if (isDev) {
      if (!finalOrgContext) {
        console.warn("⚠️ Using DEV_ORG_CONTEXT fallback for development");
        finalOrgContext = DEV_ORG_CONTEXT;
      }
      
      if (!finalUserContext) {
        console.warn("⚠️ Using DEV_USER_CONTEXT fallback for development");
        finalUserContext = DEV_USER_CONTEXT;
      }
    }

    // Validate organization context (using the possibly fallback context)
    if (!validateOrgContext(finalOrgContext, orgId)) {
      return {
        messages: [],
        org: null,
        user: null,
        userId,
        orgId,
      };
    }

    // Validate user context (logged but not blocking)
    validateUserContext(finalUserContext, userId, orgId);

    return {
      messages: [],
      org: finalOrgContext,
      user: finalUserContext,
      userId,
      orgId,
    };
  } catch (error) {
    logContextBuildingError(error, userId, orgId);
    
    // Return a consistent structure even in error cases
    return {
      messages: ["Error building context"],
      org: null,
      user: null,
      userId,
      orgId,
    };
  }
}
