import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { useContext as useLegacyContext } from '@/hooks/use-legacy-context';

/**
 * Enhanced route protection specifically for the Ask Sage route
 */
export function useAskSageRouteProtection() {
  const location = useLocation();
  const auth = useAuth();
  const { captureIntent } = useRedirectIntentManager();
  
  // Protection window state
  const [protectionActive, setProtectionActive] = useState(false);
  const protectionTimerRef = useRef<number | null>(null);
  const protectionStartTime = useRef<number | null>(null);

  // Track route transitions for Ask Sage
  useEffect(() => {
    if (location.pathname === '/ask-sage') {
      setProtectionActive(true);
      protectionStartTime.current = Date.now();

      // Set a timeout to automatically release protection
      protectionTimerRef.current = window.setTimeout(() => {
        console.log('🛡️ Ask Sage route protection window expired');
        setProtectionActive(false);
      }, 10000); // 10-second protection window

      // Capture an intent to protect the route
      captureIntent(
        '/ask-sage', 
        'user-initiated', 
        {
          source: 'ask_sage_protection',
          context: 'route_protection',
          // Store protection start time
          timestamp: protectionStartTime.current
        },
        5 // High priority protection
      );
    }

    return () => {
      if (protectionTimerRef.current) {
        window.clearTimeout(protectionTimerRef.current);
      }
    };
  }, [location.pathname, captureIntent]);

  // Prevention of unwanted redirects
  const isRedirectAllowed = (targetPath: string) => {
    if (protectionActive) {
      const allowedRoutes = ['/ask-sage', '/auth/login'];
      const isAllowedRoute = allowedRoutes.includes(targetPath);
      
      if (!isAllowedRoute) {
        console.warn('🚫 Redirect blocked during Ask Sage protection:', {
          attempted: targetPath,
          protectionActive: true,
          protectionTime: protectionStartTime.current ? 
            Math.round((Date.now() - protectionStartTime.current) / 1000) + 's' : 
            'unknown'
        });
        return false;
      }
    }
    return true;
  };

  return {
    protectionActive,
    isRedirectAllowed,
    protectionStartTime: protectionStartTime.current
  };
}
