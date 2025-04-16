
/**
 * @deprecated Use the hooks from './voice-param' instead
 * This file is kept for backwards compatibility.
 */

import { useVoiceParam, useVoiceParamState, useExplicitVoiceParam, VoiceParamState } from './voice-param';

// Re-export everything from the new module
export { useVoiceParam, useVoiceParamState, useExplicitVoiceParam };
export type { VoiceParamState };
