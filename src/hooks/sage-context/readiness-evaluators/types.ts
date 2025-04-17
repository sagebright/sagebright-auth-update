
import { SageContextReadiness } from '../types';
import { ReadinessCheck } from '../types';

/**
 * Result of the readiness evaluator
 */
export interface ReadinessEvaluatorResult {
  authCheck: ReadinessCheck;
  sessionCheck: ReadinessCheck;
  userMetadataCheck: ReadinessCheck;
  orgCheck: ReadinessCheck;
  orgMetadataCheck: ReadinessCheck;
  voiceCheck: ReadinessCheck;
  backendContextCheck: ReadinessCheck;
  stabilityCheck: ReadinessCheck;
  evaluateReadiness: () => SageContextReadiness;
}
