
import React from 'react';

interface DebugHeaderProps {
  debugState?: any;
  voiceParam?: string | null;
  voiceSource?: string;
  isSessionStable?: boolean;
  isProtected?: boolean;
  canSendMessages?: boolean;
}

export const DebugHeader: React.FC<DebugHeaderProps> = ({
  debugState,
  voiceParam,
  voiceSource,
  isSessionStable,
  isProtected,
  canSendMessages
}) => {
  // Extract values from debugState if provided
  const actualVoiceParam = voiceParam || debugState?.voiceParam;
  const actualVoiceSource = voiceSource || debugState?.voiceSource;
  const actualSessionStable = isSessionStable ?? debugState?.isSessionStable ?? true;
  const actualProtected = isProtected ?? debugState?.isProtected ?? false;
  const actualCanSendMessages = canSendMessages ?? debugState?.canSendMessages ?? true;
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-secondary/10 px-4 py-1 text-xs text-charcoal">
      🎤 Voice: <strong>{actualVoiceParam || 'default'}</strong> | Source: <strong>{actualVoiceSource || 'unknown'}</strong>
      {!actualVoiceParam && (
        <span className="text-accent1"> (Missing voice param!)</span>
      )}
      <span className="ml-2">
        🔒 Session: <strong>{actualSessionStable ? 'Stable' : 'Unstable'}</strong>
      </span>
      {actualProtected && (
        <span className="ml-2 text-primary font-medium">
          🛡️ Protection Active
        </span>
      )}
      {!actualCanSendMessages && (
        <span className="ml-2 text-amber-500 font-medium">
          ⚠️ Send Blocked
        </span>
      )}
    </div>
  );
};

// Add default export for backward compatibility
export default DebugHeader;
