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
      console.log(`NOT READY → READY at ${new Date().toISOString()}`);
      console.log(`Time to ready: ${newReadiness.readySince ? (newReadiness.readySince - performance.now()) + 'ms' : 'unknown'}`);
    } else {
      console.log(`READY → NOT READY at ${new Date().toISOString()}`);
      console.log(`Blockers: ${newReadiness.blockers.join(', ')}`);
    }
    console.groupEnd();
  } else if (
    JSON.stringify(prevReadiness?.blockers) !== 
    JSON.stringify(newReadiness.blockers)
  ) {
    // Log when blockers change, even if overall ready state remains the same
    console.log(`🔄 Context Blockers Changed: ${newReadiness.blockers.join(', ')}`);
  }
  
  // Log session stability transitions
  if (prevReadiness?.isSessionStable !== newReadiness.isSessionStable) {
    console.group('🔒 Session Stability Transition');
    if (newReadiness.isSessionStable) {
      console.log(`UNSTABLE → STABLE at ${new Date().toISOString()}`);
    } else {
      console.log(`STABLE → UNSTABLE at ${new Date().toISOString()}`);
      console.log(`Stability blockers: ${newReadiness.blockers.join(', ')}`);
    }
    console.groupEnd();
  }
}
