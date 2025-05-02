
import React from 'react';
import { useAskSageRouteProtection } from '@/hooks/ask-sage/use-route-protection';
import { useSageSessionStability } from '@/hooks/ask-sage/use-session-stability';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContextReadiness } from '@/hooks/sage-context';
import { useAskSageGuard } from '@/hooks/ask-sage/use-ask-sage-guard';
import { useContextHydration } from '@/hooks/sage-context/hydration';
import { useVoiceParamState } from '@/hooks/use-voice-param';
import { useSageContext } from '@/hooks/sage-context';

export const DebugPanel = () => {
  const { userId, orgId, user } = useAuth();
  const voiceParamState = useVoiceParamState();
  const sageContext = useSageContext();
  
  // Use the enhanced context hydration system
  const contextHydration = useContextHydration(
    voiceParamState.currentVoice,
    sageContext?.userContext,
    sageContext?.orgContext
  );
  
  const {
    canInteract,
    isProtected,
    isProtectedButReady,
    shouldRender,
    readinessBlockers,
    protectionTimeMs,
    stabilityTimeMs
  } = useAskSageGuard();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 border rounded-lg shadow-lg p-4 max-w-sm overflow-auto max-h-[80vh]">
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Debug Information</h3>
          <span className="text-xs text-muted-foreground">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
        
        <div className="border-t pt-2">
          <h4 className="font-medium text-primary">Sage Guard Status</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>Can Interact:</span>
            <span>{canInteract ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Protection Active:</span>
            <span>{isProtected ? 
              `🛡️ Yes (${protectionTimeMs ? `${Math.round(protectionTimeMs / 1000)}s` : 'N/A'})` : 
              '⚪️ No'
            }</span>
            
            <span>Should Render:</span>
            <span>{shouldRender ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Protected but Ready:</span>
            <span>{isProtectedButReady ? '🔄 Yes' : '⚪️ No'}</span>
            
            <span>Session Stability:</span>
            <span>{stabilityTimeMs ? 
              `${Math.round(stabilityTimeMs / 1000)}s stable` : 
              '⏳ Stabilizing'
            }</span>
          </div>
        </div>

        <div className="border-t pt-2">
          <h4 className="font-medium text-primary">Context Hydration {contextHydration.hydration.isComplete ? '✅' : '⏳'}</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>Progress:</span>
            <span>{contextHydration.hydration.progressPercent}%</span>
            
            <span>Duration:</span>
            <span>{
              contextHydration.hydration.duration 
                ? `${Math.round(contextHydration.hydration.duration)}ms` 
                : 'In progress...'
            }</span>
            
            <span>Auth Ready:</span>
            <span>{contextHydration.isAuthReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Session Ready:</span>
            <span>{contextHydration.isSessionReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>User Metadata:</span>
            <span>{contextHydration.isUserMetadataReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Org Ready:</span>
            <span>{contextHydration.isOrgReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Voice Ready:</span>
            <span>{contextHydration.isVoiceReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Backend Ready:</span>
            <span>{contextHydration.isBackendContextReady ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Ready to Render:</span>
            <span>{contextHydration.isReadyToRender ? '✅ Yes' : '⚠️ No'}</span>
            
            <span>Ready to Send:</span>
            <span>{contextHydration.isReadyToSend ? '✅ Yes' : '⚠️ No'}</span>
          </div>
        </div>

        <div className="border-t pt-2">
          <h4 className="font-medium text-primary">Auth Context</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>User ID:</span>
            <span>{userId || 'N/A'}</span>
            
            <span>Org ID:</span>
            <span>{orgId || 'N/A'}</span>
            
            <span>Role:</span>
            <span>{user?.user_metadata?.role || 'N/A'}</span>
            
            <span>Voice:</span>
            <span>{voiceParamState.currentVoice || 'default'}</span>
          </div>
        </div>
        
        <div className="border-t pt-2">
          <h4 className="font-medium text-primary">Backend Context</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>User Context:</span>
            <span>{contextHydration.backendContext.userContext ? '✅ Loaded' : '⚠️ Missing'}</span>
            
            <span>Org Context:</span>
            <span>{contextHydration.backendContext.orgContext ? '✅ Loaded' : '⚠️ Missing'}</span>
            
            <span>Loading:</span>
            <span>{contextHydration.backendContext.isLoading ? '⏳ Yes' : '⚪️ No'}</span>
            
            <span>Error:</span>
            <span>{contextHydration.backendContext.error ? '❌ Yes' : '✅ None'}</span>
          </div>
        </div>

        {readinessBlockers && readinessBlockers.length > 0 && (
          <div className="border-t pt-2">
            <h4 className="font-medium text-primary">Active Blockers</h4>
            <div className="mt-1 space-y-1">
              {readinessBlockers.map((blocker, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-red-500">⚠️</span>
                  <span className="text-red-500">{blocker}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Display categorized blockers when present */}
        {contextHydration.blockersByCategory && 
         typeof contextHydration.blockersByCategory === 'object' &&
         Object.keys(contextHydration.blockersByCategory).length > 0 && (
          <div className="border-t pt-2">
            <h4 className="font-medium text-primary">Blockers By Category</h4>
            <div className="mt-1 space-y-2">
              {Object.entries(contextHydration.blockersByCategory).map(([category, blockers]) => (
                <div key={category} className="space-y-1">
                  <h5 className="text-xs font-medium text-muted-foreground">{category}</h5>
                  {Array.isArray(blockers) && blockers.map((blocker, index) => (
                    <div key={index} className="pl-2 text-xs text-red-500">
                      • {blocker}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
