
import { SageContextReadiness } from '../types';
import { 
  ReadinessCheck 
} from '../readiness-checks/readiness-utils';

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
