import { SageContextReadiness } from './types';

/**
 * Logs transitions in context readiness state
 */
export function logReadinessTransition(
  prevReadiness: SageContextReadiness | null,
  newReadiness: SageContextReadiness
): void {
  // Log transitions in readiness state
  if (prevReadiness?.isReadyToRender !== newReadiness.isReadyToRender) {
    console.group('🔄 Context Readiness Transition');
    if (newReadiness.isReadyToRender) {
      console.log(`✅ NOT READY → READY at ${new Date().toISOString()}`);
      console.log(`Time to ready: ${newReadiness.readySince ? (newReadiness.readySince - performance.now()) + 'ms' : 'unknown'}`);
      
      // Log each component that's ready
      console.log('Ready components:', {
        auth: newReadiness.isAuthReady,
        session: newReadiness.isSessionReady,
        userMetadata: newReadiness.isUserMetadataReady,
        org: newReadiness.isOrgReady,
        orgMetadata: newReadiness.isOrgMetadataReady,
        orgSlug: newReadiness.isOrgSlugReady,
        voice: newReadiness.isVoiceReady,
        backend: newReadiness.isBackendContextReady
      });
    } else {
      console.log(`⚠️ READY → NOT READY at ${new Date().toISOString()}`);
      console.log(`Blockers: ${newReadiness.blockers.join(', ')}`);
      
      // Log categorized blockers
      if (Object.keys(newReadiness.blockersByCategory).length > 0) {
        console.log('Blockers by category:', newReadiness.blockersByCategory);
      }
    }
    console.groupEnd();
  } else if (
    JSON.stringify(prevReadiness?.blockers) !== 
    JSON.stringify(newReadiness.blockers)
  ) {
    // Log when blockers change, even if overall ready state remains the same
    console.log(`🔄 Context Blockers Changed:`, newReadiness.blockers);
    
    // Compare changed blockers by category
    if (prevReadiness?.blockersByCategory && newReadiness.blockersByCategory) {
      const prevCategories = Object.keys(prevReadiness.blockersByCategory);
      const newCategories = Object.keys(newReadiness.blockersByCategory);
      
      // Log added categories
      const addedCategories = newCategories.filter(cat => !prevCategories.includes(cat));
      if (addedCategories.length > 0) {
        console.log('New blocker categories:', addedCategories);
      }
      
      // Log resolved categories
      const resolvedCategories = prevCategories.filter(cat => !newCategories.includes(cat));
      if (resolvedCategories.length > 0) {
        console.log('Resolved blocker categories:', resolvedCategories);
      }
    }
  }
  
  // Log 'isReadyToSend' state transitions
  if (prevReadiness?.isReadyToSend !== newReadiness.isReadyToSend) {
    console.group('📤 Message Sending Capability');
    if (newReadiness.isReadyToSend) {
      console.log(`🟢 NOW READY TO SEND MESSAGES at ${new Date().toISOString()}`);
    } else {
      console.log(`🔴 NOW BLOCKED FROM SENDING MESSAGES at ${new Date().toISOString()}`);
      console.log('Send blockers:', newReadiness.blockers);
    }
    console.groupEnd();
  }
  
  // Log session stability transitions
  if (prevReadiness?.isSessionStable !== newReadiness.isSessionStable) {
    console.group('🔒 Session Stability Transition');
    if (newReadiness.isSessionStable) {
      console.log(`🔓 UNSTABLE → STABLE at ${new Date().toISOString()}`);
    } else {
      console.log(`🔒 STABLE → UNSTABLE at ${new Date().toISOString()}`);
      console.log(`Stability blockers: ${newReadiness.blockers.join(', ')}`);
    }
    console.groupEnd();
  }
}

/**
 * Log the detailed dependency status
 */
export function logDependencyStatus(
  componentName: string,
  dependencies: Record<string, boolean>,
  blockersByCategory: Record<string, string[]> = {}
): void {
  console.group(`🔍 ${componentName} Dependencies`);
  console.log('Status:', dependencies);
  
  if (Object.keys(blockersByCategory).length > 0) {
    console.log('Blockers by category:');
    for (const [category, blockers] of Object.entries(blockersByCategory)) {
      console.log(`  ${category}:`, blockers);
    }
  }
  
  console.groupEnd();
}
