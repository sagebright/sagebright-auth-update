
import { useEffect } from 'react';
import { SageContextReadiness } from '@/hooks/use-sage-context-readiness';

export const useContextMonitor = (
  contextReadiness: SageContextReadiness, 
  isAuthenticated: boolean, 
  userId: string | null, 
  orgId: string | null, 
  isRecoveringOrg: boolean,
  user: any,
  voiceParam: string | null,
  pageInitialized: boolean,
  setIsRecoveryVisible: (value: boolean) => void
) => {
  // Log context readiness
  useEffect(() => {
    console.log("🔍 Context readiness from useSageContextReadiness:", {
      isContextReady: contextReadiness.isContextReady,
      contextCheckComplete: contextReadiness.contextCheckComplete,
      missingContext: contextReadiness.missingContext,
      isReadyToRender: contextReadiness.isReadyToRender,
      isSessionStable: contextReadiness.isSessionStable,
      blockers: contextReadiness.blockers,
      readySince: contextReadiness.readySince ? new Date(contextReadiness.readySince).toISOString() : null,
      timestamp: new Date().toISOString()
    });
  }, [
    contextReadiness.isContextReady, 
    contextReadiness.contextCheckComplete, 
    contextReadiness.missingContext, 
    contextReadiness.isReadyToRender, 
    contextReadiness.isSessionStable, 
    contextReadiness.blockers, 
    contextReadiness.readySince
  ]);

  // Log URL state
  useEffect(() => {
    console.log("🌐 Current URL state:", { 
      pathname: window.location.pathname,
      search: window.location.search,
      href: window.location.href,
      historyLength: window.history.length
    });
  }, []);

  // Check if org recovery is needed
  useEffect(() => {
    if (pageInitialized && userId && !orgId && !isRecoveringOrg) {
      console.log("⚠️ Missing org context, showing recovery dialog");
      setIsRecoveryVisible(true);
    } else if (pageInitialized) {
      setIsRecoveryVisible(false);
    }
  }, [userId, orgId, isRecoveringOrg, pageInitialized, setIsRecoveryVisible]);

  // Log page initialization
  useEffect(() => {
    if (isAuthenticated && !pageInitialized) {
      console.log("🚀 AskSage page initialized with auth state:", { 
        userId, 
        orgId, 
        isRecoveringOrg,
        hasSessionMetadata: user ? !!user.user_metadata : false,
        voiceParam,
        urlSearch: window.location.search,
        timestamp: new Date().toISOString()
      });
    }
  }, [isAuthenticated, userId, orgId, isRecoveringOrg, pageInitialized, voiceParam, user]);
};
