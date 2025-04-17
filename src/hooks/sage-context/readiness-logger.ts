
import { SageContextReadiness } from './types';

/**
 * Logs a state transition in the readiness state
 */
export function logReadinessTransition(
  prevState: SageContextReadiness | null,
  newState: SageContextReadiness
) {
  if (!prevState) {
    console.log('🔄 Initial readiness state:', {
      isContextReady: newState.isContextReady,
      isReadyToRender: newState.isReadyToRender,
      isReadyToSend: newState.isReadyToSend,
      blockers: newState.blockers
    });
    return;
  }
  
  const changes: Record<string, { from: any; to: any }> = {};
  
  // Check for changes in boolean flags
  const flags = [
    'isAuthReady', 
    'isSessionReady', 
    'isOrgReady', 
    'isVoiceReady', 
    'isUserMetadataReady',
    'isOrgMetadataReady', 
    'isOrgSlugReady', 
    'isBackendContextReady',
    'isReadyToRender',
    'isReadyToSend',
    'isSessionStable'
  ] as const;
  
  flags.forEach(flag => {
    if (prevState[flag] !== newState[flag]) {
      changes[flag] = {
        from: prevState[flag],
        to: newState[flag]
      };
    }
  });
  
  // Check for changes in blockers
  if (JSON.stringify(prevState.blockers) !== JSON.stringify(newState.blockers)) {
    const removedBlockers = prevState.blockers.filter(
      blocker => !newState.blockers.includes(blocker)
    );
    
    const addedBlockers = newState.blockers.filter(
      blocker => !prevState.blockers.includes(blocker)
    );
    
    if (removedBlockers.length > 0 || addedBlockers.length > 0) {
      changes.blockers = {
        from: prevState.blockers,
        to: newState.blockers
      };
    }
  }
  
  // Log changes if any detected
  if (Object.keys(changes).length > 0) {
    console.log('🔄 Readiness state changed:', changes);
    
    // Log achievement of key milestones
    if (!prevState.isReadyToRender && newState.isReadyToRender) {
      console.log('✅ Context is now ready to render!');
    }
    
    if (!prevState.isReadyToSend && newState.isReadyToSend) {
      console.log('✅ Context is now ready to send messages!');
    }
    
    if (!prevState.isSessionStable && newState.isSessionStable) {
      console.log('✅ Session is now stable!');
    }
  }
}

/**
 * Logs the status of all dependencies
 */
export function logDependencyStatus(
  context: string,
  status: Record<string, boolean>,
  blockersByCategory: Record<string, string[]> = {}
) {
  console.log(`📊 ${context} dependency status:`, status);
  
  const categories = Object.keys(blockersByCategory);
  if (categories.length > 0) {
    console.log('⚠️ Active blockers by category:');
    categories.forEach(category => {
      const blockers = blockersByCategory[category];
      if (blockers && blockers.length > 0) {
        console.log(`  ${category}:`, blockers);
      }
    });
  }
}
