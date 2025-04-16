
import { useState, useEffect } from 'react';
import { useSageContextReadiness } from './use-sage-context-readiness';
import { useAuth } from '@/contexts/auth/AuthContext';
import { buildSageContext } from '@/lib/buildSageContext';

/**
 * Hook to track and ensure complete context hydration
 * Centralizes the logic for fetching backend context data
 */
export function useContextHydration(voiceParam: string | null = null) {
  const { 
    userId, 
    orgId, 
    user, 
    loading: authLoading, 
    sessionUserReady 
  } = useAuth();
  
  const [backendContext, setBackendContext] = useState<{
    userContext: any | null;
    orgContext: any | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    userContext: null,
    orgContext: null,
    isLoading: false,
    error: null
  });
  
  // Track hydration progress
  const [hydrationProgress, setHydrationProgress] = useState<{
    startTime: number | null;
    endTime: number | null;
    duration: number | null;
    completedSteps: string[];
    totalSteps: number;
  }>({
    startTime: null,
    endTime: null,
    duration: null,
    completedSteps: [],
    totalSteps: 5 // Auth, Session, User Metadata, Org, and Voice
  });
  
  // Extract the orgSlug from user metadata
  const orgSlug = user?.user_metadata?.org_slug ?? null;
  
  // Use the context readiness hook with backend context
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    user,
    authLoading,
    sessionUserReady,
    voiceParam,
    {
      userContext: backendContext.userContext,
      orgContext: backendContext.orgContext
    }
  );
  
  // Start tracking hydration when user signs in
  useEffect(() => {
    if (userId && !hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        startTime: Date.now(),
        completedSteps: [...prev.completedSteps, 'authentication']
      }));
    }
  }, [userId, hydrationProgress.startTime]);
  
  // Track completion of auth step
  useEffect(() => {
    if (contextReadiness.isAuthReady && 
        !hydrationProgress.completedSteps.includes('auth') && 
        hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'auth']
      }));
    }
  }, [contextReadiness.isAuthReady, hydrationProgress]);
  
  // Track completion of session step
  useEffect(() => {
    if (contextReadiness.isSessionReady && 
        !hydrationProgress.completedSteps.includes('session') && 
        hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'session']
      }));
    }
  }, [contextReadiness.isSessionReady, hydrationProgress]);
  
  // Track completion of org step
  useEffect(() => {
    if (contextReadiness.isOrgReady && 
        !hydrationProgress.completedSteps.includes('org') && 
        hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'org']
      }));
    }
  }, [contextReadiness.isOrgReady, hydrationProgress]);
  
  // Track completion of voice step
  useEffect(() => {
    if (contextReadiness.isVoiceReady && 
        !hydrationProgress.completedSteps.includes('voice') && 
        hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'voice']
      }));
    }
  }, [contextReadiness.isVoiceReady, hydrationProgress]);
  
  // Fetch backend context when auth and org are ready
  useEffect(() => {
    const fetchBackendContext = async () => {
      if (!userId || !orgId || !orgSlug || backendContext.isLoading) {
        return;
      }
      
      // Only fetch backend context once auth and org are ready
      if (!contextReadiness.isAuthReady || !contextReadiness.isOrgReady) {
        return;
      }
      
      try {
        setBackendContext(prev => ({ ...prev, isLoading: true, error: null }));
        
        console.log('🔄 Fetching backend context for:', {
          userId,
          orgId,
          orgSlug
        });
        
        // Use the buildSageContext function to fetch both user and org context
        const fullContext = await buildSageContext(userId, orgId, orgSlug, user);
        
        if (!fullContext) {
          throw new Error('Failed to build context');
        }
        
        setBackendContext({
          userContext: fullContext.user,
          orgContext: fullContext.org,
          isLoading: false,
          error: null
        });
        
        // Add backend to completed steps
        setHydrationProgress(prev => ({
          ...prev,
          completedSteps: [...prev.completedSteps, 'backend']
        }));
        
        console.log('✅ Backend context loaded:', {
          hasUserContext: !!fullContext.user,
          hasOrgContext: !!fullContext.org
        });
      } catch (error) {
        console.error('❌ Error fetching backend context:', error);
        setBackendContext(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error : new Error('Unknown error') 
        }));
      }
    };
    
    fetchBackendContext();
  }, [userId, orgId, orgSlug, user, contextReadiness.isAuthReady, contextReadiness.isOrgReady, backendContext.isLoading]);
  
  // Calculate hydration completion
  useEffect(() => {
    if (contextReadiness.isReadyToRender && hydrationProgress.startTime && !hydrationProgress.endTime) {
      const endTime = Date.now();
      const duration = endTime - hydrationProgress.startTime;
      
      setHydrationProgress(prev => ({
        ...prev,
        endTime,
        duration
      }));
      
      console.log(`✅ Context hydration complete in ${duration}ms`, {
        startTime: new Date(hydrationProgress.startTime!).toISOString(),
        endTime: new Date(endTime).toISOString(),
        completedSteps: [...hydrationProgress.completedSteps, 'ready_to_render']
      });
    }
  }, [contextReadiness.isReadyToRender, hydrationProgress]);
  
  return {
    ...contextReadiness,
    backendContext: {
      userContext: backendContext.userContext,
      orgContext: backendContext.orgContext,
      isLoading: backendContext.isLoading,
      error: backendContext.error
    },
    hydration: {
      ...hydrationProgress,
      isComplete: !!hydrationProgress.endTime,
      progressPercent: Math.round(
        (hydrationProgress.completedSteps.length / hydrationProgress.totalSteps) * 100
      )
    }
  };
}
