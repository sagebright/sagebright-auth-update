import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useVoiceParamState } from '@/hooks/use-voice-param';
import { useSageContext } from '@/hooks/sage-context';
import { useAskSageGuard } from '@/hooks/ask-sage/use-ask-sage-guard';
import { useContextHydration } from '@/hooks/sage-context/hydration';

// Define the voice transition record structure
interface VoiceTransition {
  previousVoice: string | null;
  newVoice: string | null;
  timestamp: number;
  source: string;
}

// Define the props needed for the debug panel
interface DebugPanelProps {
  voiceTransitions?: VoiceTransition[];
  timestamp?: number;
  userData?: any;
  orgData?: any;
}

export const DebugPanel: React.FC<DebugPanelProps> = (props) => {
  const { userId, orgId, user } = useAuth();
  const voiceParamState = useVoiceParamState();
  const sageContext = useSageContext();
  
  // Track voice transition history
  const [voiceTransitions, setVoiceTransitions] = useState<VoiceTransition[]>(props.voiceTransitions || []);
  
  // Use the enhanced context hydration system
  const contextHydration = useContextHydration({
    userId: userId || '',
    orgId: orgId || '',
    orgSlug: ''
  });
  
  const guard = useAskSageGuard();
  
  // Define variables with fallback values
  const {
    canInteract,
    isProtected,
    shouldRender,
    readinessBlockers,
  } = guard;
  
  // Define missing properties with defaults for backward compatibility
  const isProtectedButReady = guard.isProtectedButReady || false;
  const protectionTimeMs = guard.protectionTimeMs || 0;
  const stabilityTimeMs = guard.stabilityTimeMs || 0;

  // Load voice transitions from localStorage and track new ones
  useEffect(() => {
    // Load existing transitions from localStorage
    const storedTransitions = localStorage.getItem('voiceParamTransitions');
    const parsedTransitions = storedTransitions ? JSON.parse(storedTransitions) : [];
    setVoiceTransitions(parsedTransitions);
    
    // Track current voice param for change detection
    const currentVoice = voiceParamState.currentVoice;
    const currentSource = voiceParamState.source || 'unknown';
    
    return () => {
      // When voice changes, record the transition
      if (voiceParamState.currentVoice !== currentVoice) {
        const newTransition: VoiceTransition = {
          previousVoice: currentVoice,
          newVoice: voiceParamState.currentVoice,
          timestamp: Date.now(),
          source: currentSource
        };
        
        // Get existing transitions and add new one at the beginning
        const existingTransitions = localStorage.getItem('voiceParamTransitions');
        const parsedTransitions = existingTransitions ? JSON.parse(existingTransitions) : [];
        const updatedTransitions = [newTransition, ...parsedTransitions].slice(0, 3); // Keep last 3
        
        // Save back to localStorage
        localStorage.setItem('voiceParamTransitions', JSON.stringify(updatedTransitions));
        
        // Update state
        setVoiceTransitions(updatedTransitions);
      }
    };
  }, [voiceParamState.currentVoice, voiceParamState.source]);

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
          <h4 className="font-medium text-primary">Voice Parameters</h4>
          <div className="grid grid-cols-2 gap-1">
            <span>Current Voice:</span>
            <span>{voiceParamState.currentVoice || 'default'}</span>
            
            <span>Source:</span>
            <span>{voiceParamState.source || 'N/A'}</span>
            
            <span>Is Valid:</span>
            <span>{voiceParamState.isValid ? '✅ Yes' : '⚠️ No'}</span>
          </div>
          
          {voiceTransitions.length > 0 && (
            <div className="mt-2">
              <h5 className="text-xs font-medium mb-1">Recent Voice Transitions:</h5>
              <div className="space-y-2 bg-muted/30 p-2 rounded text-[10px]">
                {voiceTransitions.map((transition, index) => (
                  <div key={index} className="flex flex-col">
                    <span>
                      {new Date(transition.timestamp).toLocaleTimeString()} via {transition.source}
                    </span>
                    <span className="font-mono">
                      {transition.previousVoice || '(none)'} → {transition.newVoice || '(none)'}
                    </span>
                    {index < voiceTransitions.length - 1 && <hr className="my-1 border-muted" />}
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default DebugPanel;
