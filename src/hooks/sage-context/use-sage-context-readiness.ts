
import { useEffect, useRef } from 'react';
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
  // Track render counts to prevent excessive logging
  const renderCountRef = useRef(0);
  
  // Only log on first render
  useEffect(() => {
    renderCountRef.current += 1;
    
    if (renderCountRef.current === 1) {
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
    }
  }, [userId, orgId, orgSlug, currentUserData, authLoading, isSessionUserReady, voiceParam, backend]);

  // Extract backend context values
  const { userContext = null, orgContext = null } = backend;
  
  // Use our extracted state management hook
  const { readiness, setReadiness } = useReadinessState();
  
  // Track evaluation state to prevent multiple evaluations for the same input
  const hasEvaluatedRef = useRef(false);
  const previousInputsRef = useRef({
    userId,
    orgId,
    orgSlug,
    currentUserDataExists: !!currentUserData,
    authLoading,
    isSessionUserReady,
    voiceParam,
  });
  
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
      return;
    }
    
    // Check if inputs have changed to avoid unnecessary re-evaluations
    const currentInputs = {
      userId,
      orgId,
      orgSlug,
      currentUserDataExists: !!currentUserData,
      authLoading,
      isSessionUserReady,
      voiceParam,
    };
    
    const inputsChanged = 
      previousInputsRef.current.userId !== currentInputs.userId ||
      previousInputsRef.current.orgId !== currentInputs.orgId ||
      previousInputsRef.current.orgSlug !== currentInputs.orgSlug ||
      previousInputsRef.current.currentUserDataExists !== currentInputs.currentUserDataExists ||
      previousInputsRef.current.authLoading !== currentInputs.authLoading ||
      previousInputsRef.current.isSessionUserReady !== currentInputs.isSessionUserReady ||
      previousInputsRef.current.voiceParam !== currentInputs.voiceParam;
    
    // Only log and evaluate if this is the first evaluation or inputs have changed
    if (!hasEvaluatedRef.current || inputsChanged) {
      console.log("🔍 Evaluating context readiness with params:", {
        hasUserId: !!userId,
        hasOrgId: !!orgId,
        authComplete: !authLoading,
        inputsChanged
      });
      
      // Evaluate readiness and update state
      const newReadiness = evaluateReadiness();
      setReadiness(newReadiness);
      
      // Update refs
      hasEvaluatedRef.current = true;
      previousInputsRef.current = currentInputs;
    }
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
  
  // Track readiness state changes to log only when they change
  const prevReadinessStateRef = useRef({
    isReadyToRender: readiness.isReadyToRender,
    isReadyToSend: readiness.isReadyToSend,
    isContextReady: readiness.isContextReady,
    contextCheckComplete: readiness.contextCheckComplete,
    blockerCount: readiness.blockers.length
  });
  
  useEffect(() => {
    const current = {
      isReadyToRender: readiness.isReadyToRender,
      isReadyToSend: readiness.isReadyToSend,
      isContextReady: readiness.isContextReady,
      contextCheckComplete: readiness.contextCheckComplete,
      blockerCount: readiness.blockers.length
    };
    
    const hasChanged = 
      prevReadinessStateRef.current.isReadyToRender !== current.isReadyToRender ||
      prevReadinessStateRef.current.isReadyToSend !== current.isReadyToSend ||
      prevReadinessStateRef.current.isContextReady !== current.isContextReady ||
      prevReadinessStateRef.current.contextCheckComplete !== current.contextCheckComplete ||
      prevReadinessStateRef.current.blockerCount !== current.blockerCount;
    
    if (hasChanged) {
      console.log("📊 Context readiness state changed:", {
        isReadyToRender: readiness.isReadyToRender,
        isReadyToSend: readiness.isReadyToSend,
        isContextReady: readiness.isContextReady,
        contextCheckComplete: readiness.contextCheckComplete,
        blockerCount: readiness.blockers.length,
        blockers: readiness.blockers
      });
      
      prevReadinessStateRef.current = current;
    }
  }, [
    readiness.isReadyToRender,
    readiness.isReadyToSend,
    readiness.isContextReady,
    readiness.contextCheckComplete,
    readiness.blockers
  ]);
  
  return readiness;
}
