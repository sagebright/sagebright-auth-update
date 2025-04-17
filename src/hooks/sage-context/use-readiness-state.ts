
import { useState, useRef } from 'react';
import { SageContextReadiness } from './types';
import { logReadinessTransition } from './readiness-logger';

/**
 * Hook to manage the readiness state with proper transition logging
 */
export function useReadinessState(): {
  readiness: SageContextReadiness;
  prevReadinessRef: React.MutableRefObject<SageContextReadiness | null>;
  setReadiness: (newReadiness: SageContextReadiness) => void;
} {
  // Initialize state with not-ready values
  const [readiness, setReadinessState] = useState<SageContextReadiness>({
    isOrgReady: false,
    isSessionReady: false,
    isVoiceReady: false,
    isReadyToRender: false,
    isSessionStable: false,
    isContextReady: false,
    contextCheckComplete: false,
    missingContext: true,
    readySince: null,
    blockers: ['Initializing context'],
    
    // Granular readiness flags
    isAuthReady: false,
    isUserMetadataReady: false,
    isOrgMetadataReady: false,
    isOrgSlugReady: false,
    isBackendContextReady: false,
    isReadyToSend: false,
    
    // Categorized blockers
    blockersByCategory: {
      auth: ['Initializing authentication']
    }
  });
  
  // Track previous state for transition logging
  const prevReadinessRef = useRef<SageContextReadiness | null>(null);
  
  // Wrapper for setState that also logs transitions
  const setReadiness = (newReadiness: SageContextReadiness) => {
    logReadinessTransition(prevReadinessRef.current, newReadiness);
    prevReadinessRef.current = newReadiness;
    setReadinessState(newReadiness);
  };
  
  return { readiness, prevReadinessRef, setReadiness };
}
