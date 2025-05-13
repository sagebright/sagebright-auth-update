
/// <reference types="vite/client" />
/// <reference path="./lib/api/types.ts" />

// Define sage context interface for TypeScript
interface SageContext {
  context: any;
  loading: boolean;
  error: Error | null;
  timedOut?: boolean;
  fallbackMessage?: string | null;
  userContext: any;
  orgContext: any;
  voiceConfig: any;
  isReady: boolean;
}
