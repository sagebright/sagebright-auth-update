import React from 'react';
import { useAskSageRouteProtection } from '@/hooks/ask-sage/use-route-protection';
import { useSageSessionStability } from '@/hooks/ask-sage/use-session-stability';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContextReadiness } from '@/hooks/use-sage-context-readiness';

export const DebugPanel = () => {
  const { protectionActive, protectionStartTime } = useAskSageRouteProtection();
  const { sessionStable, isContextReady } = useSageSessionStability();
  const { userId, orgId, user } = useAuth();
  const contextReadiness = useSageContextReadiness(userId, orgId, user?.user_metadata?.org_slug ?? null, user, false, !!user, 'default');

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 border rounded-lg shadow-lg p-4 max-w-sm overflow-auto">
      <div className="space-y-2 text-xs">
        <h3 className="font-medium">Debug Information</h3>
        
        {/* Protection Status */}
        <div className="border-t pt-2">
          <h4 className="font-medium text-primary">Route Protection</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>Protection Active:</span>
            <span>{protectionActive ? '🛡️ Yes' : '⚪️ No'}</span>
            
            <span>Protection Time:</span>
            <span>
              {protectionStartTime ? 
                `${Math.round((Date.now() - protectionStartTime) / 1000)}s` : 
                'N/A'}
            </span>
          </div>
        </div>

        {/* Session Stability */}
        <div className="border-t pt-2">
          <h4 className="font-medium text-primary">Session Status</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>Session Stable:</span>
            <span>{sessionStable ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Context Ready:</span>
            <span>{isContextReady ? '✅ Yes' : '⚠️ No'}</span>
          </div>
        </div>

        {/* Auth Context */}
        <div className="border-t pt-2">
          <h4 className="font-medium text-primary">Auth Context</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>User ID:</span>
            <span>{userId || 'N/A'}</span>
            
            <span>Org ID:</span>
            <span>{orgId || 'N/A'}</span>
          </div>
        </div>

        {/* Context Readiness */}
        <div className="border-t pt-2">
          <h4 className="font-medium text-primary">Context Readiness</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>Session Ready:</span>
            <span>{contextReadiness.isSessionReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Org Ready:</span>
            <span>{contextReadiness.isOrgReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Voice Ready:</span>
            <span>{contextReadiness.isVoiceReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Ready to Render:</span>
            <span>{contextReadiness.isReadyToRender ? '✅ Yes' : '⚠️ No'}</span>
          </div>
        </div>

        {/* Blockers */}
        {contextReadiness.blockers.length > 0 && (
          <div className="border-t pt-2">
            <h4 className="font-medium text-primary">Blockers</h4>
            <ul>
              {contextReadiness.blockers.map((blocker, index) => (
                <li key={index} className="text-red-500">{blocker}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
