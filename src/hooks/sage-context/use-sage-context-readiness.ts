
import { useEffect } from 'react';
import { SageContextReadiness } from './types';
import { useReadinessState } from './use-readiness-state';
import { useReadinessEvaluator } from './use-readiness-evaluator';

/**
 * Enhanced hook that provides granular context readiness states for Sage
 * with decoupled checks, better error handling, and improved logging
 */
export function useSageContextReadiness(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null,
  authLoading: boolean,
  isSessionUserReady: boolean,
  voiceParam: string | null = null, // Making this optional with a default value
  backend: {
    userContext?: any | null,
    orgContext?: any | null
  } = {}
): SageContextReadiness {
  console.log("🧪 useSageContextReadiness mounted", { 
    userId, 
    orgId, 
    hasOrgSlug: !!orgSlug,
    hasUserData: !!currentUserData,
    authLoading,
    isSessionUserReady,
    voiceParam,
    hasBackendContext: !!(backend.userContext || backend.orgContext)
  });

  // Extract backend context values
  const { userContext = null, orgContext = null } = backend;
  
  // Use our extracted state management hook
  const { readiness, setReadiness } = useReadinessState();
  
  // Use our extracted evaluator hook
  const { evaluateReadiness } = useReadinessEvaluator(
    userId,
    orgId,
    orgSlug,
    currentUserData,
    isSessionUserReady,
    voiceParam,
    userContext,
    orgContext,
    readiness
  );
  
  useEffect(() => {
    // Don't evaluate until auth loading is complete
    if (authLoading) {
      console.log("⏳ Auth still loading, delaying readiness evaluation");
      return;
    }
    
    console.log("🔍 Evaluating context readiness with params:", {
      hasUserId: !!userId,
      hasOrgId: !!orgId,
      authComplete: !authLoading
    });
    
    // Evaluate readiness and update state
    const newReadiness = evaluateReadiness();
    setReadiness(newReadiness);
  }, [
    userId, 
    orgId, 
    orgSlug, 
    currentUserData, 
    authLoading, 
    isSessionUserReady, 
    voiceParam, 
    userContext,
    orgContext,
    evaluateReadiness,
    setReadiness
  ]);
  
  console.log("📊 Context readiness state:", {
    isReadyToRender: readiness.isReadyToRender,
    isReadyToSend: readiness.isReadyToSend,
    isContextReady: readiness.isContextReady,
    contextCheckComplete: readiness.contextCheckComplete,
    blockerCount: readiness.blockers.length,
    blockers: readiness.blockers
  });
  
  return readiness;
}
