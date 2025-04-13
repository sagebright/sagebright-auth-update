
import { useState, useEffect } from 'react';
import { useVoiceParam } from './use-voice-param';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';

interface DebugInfo {
  voice: {
    param: string;
    source: 'url' | 'default' | 'fallback';
    raw: string;
    timestamp: string;
  };
  context: {
    userId: string | null;
    orgId: string | null;
    hasUser: boolean;
    hasUserMetadata: boolean;
    hasCurrentUser: boolean;
  };
  request: {
    status: 'idle' | 'loading' | 'success' | 'error';
    timestamp: string | null;
    responseTime: number | null;
    error: string | null;
  };
}

/**
 * Hook to track debug information for development
 */
export function useDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    voice: {
      param: 'default',
      source: 'default',
      raw: '',
      timestamp: new Date().toISOString() // Add the missing timestamp property
    },
    context: {
      userId: null,
      orgId: null,
      hasUser: false,
      hasUserMetadata: false,
      hasCurrentUser: false,
    },
    request: {
      status: 'idle',
      timestamp: null,
      responseTime: null,
      error: null,
    }
  });
  
  const location = useLocation();
  const voice = useVoiceParam();
  const { user, userId, orgId, currentUser } = useAuth();
  
  // Determine if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  // Update voice debug info with more detailed tracking
  useEffect(() => {
    if (!isDev) return;
    
    // Determine the source of the voice parameter
    let source: 'url' | 'default' | 'fallback' = 'default';
    const urlVoice = new URLSearchParams(location.search).get('voice');
    const windowVoice = new URLSearchParams(window.location.search).get('voice');
    
    if (urlVoice) {
      source = 'url';
    } else if (!urlVoice && windowVoice) {
      source = 'fallback';
    }
    
    console.log("🔍 Debug panel tracking voice (timestamp: %s):", new Date().toISOString(), {
      voice,
      source,
      urlVoice,
      windowVoice,
      location: location.search,
      windowLocation: window.location.search
    });
    
    setDebugInfo(prev => ({
      ...prev,
      voice: {
        param: voice,
        source,
        raw: location.search,
        timestamp: new Date().toISOString()
      }
    }));
  }, [voice, location.search, isDev]);
  
  // Update auth context debug info
  useEffect(() => {
    if (!isDev) return;
    
    setDebugInfo(prev => ({
      ...prev,
      context: {
        userId,
        orgId,
        hasUser: !!user,
        hasUserMetadata: user ? !!user.user_metadata : false,
        hasCurrentUser: !!currentUser,
      }
    }));
  }, [user, userId, orgId, currentUser, isDev]);
  
  // Methods to update request status
  const setRequestLoading = () => {
    if (!isDev) return;
    
    setDebugInfo(prev => ({
      ...prev,
      request: {
        ...prev.request,
        status: 'loading',
        timestamp: new Date().toISOString(),
        error: null,
      }
    }));
  };
  
  const setRequestSuccess = (responseTime: number) => {
    if (!isDev) return;
    
    setDebugInfo(prev => ({
      ...prev,
      request: {
        ...prev.request,
        status: 'success',
        responseTime,
      }
    }));
  };
  
  const setRequestError = (error: string) => {
    if (!isDev) return;
    
    setDebugInfo(prev => ({
      ...prev,
      request: {
        ...prev.request,
        status: 'error',
        error,
      }
    }));
  };
  
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };
  
  return {
    isVisible,
    toggleVisibility,
    debugInfo,
    setRequestLoading,
    setRequestSuccess,
    setRequestError,
    isDev
  };
}
