
import React from 'react';

interface DebugHeaderProps {
  voiceParam: string | null;
  voiceSource: string;
  isSessionStable: boolean;
  isProtected: boolean;
  canSendMessages: boolean;
}

export const DebugHeader: React.FC<DebugHeaderProps> = ({
  voiceParam,
  voiceSource,
  isSessionStable,
  isProtected,
  canSendMessages
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-secondary/10 px-4 py-1 text-xs text-charcoal">
      🎤 Voice: <strong>{voiceParam}</strong> | Source: <strong>{voiceSource}</strong>
      {!voiceParam && (
        <span className="text-accent1"> (Missing voice param!)</span>
      )}
      <span className="ml-2">
        🔒 Session: <strong>{isSessionStable ? 'Stable' : 'Unstable'}</strong>
      </span>
      {isProtected && (
        <span className="ml-2 text-primary font-medium">
          🛡️ Protection Active
        </span>
      )}
      {!canSendMessages && (
        <span className="ml-2 text-amber-500 font-medium">
          ⚠️ Send Blocked
        </span>
      )}
    </div>
  );
};
