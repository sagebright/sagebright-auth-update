
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { useAuth } from '@/contexts/auth/AuthContext';

/**
 * Enhanced route protection specifically for the Ask Sage route
 */
export function useAskSageRouteProtection() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { captureIntent, activeIntent } = useRedirectIntentManager();

  // Protection window state
  const [protectionActive, setProtectionActive] = useState(false);
  const protectionTimerRef = useRef<number | null>(null);

  // Track route transitions for Ask Sage
  useEffect(() => {
    // Only activate protection for /ask-sage route
    if (location.pathname === '/ask-sage') {
      setProtectionActive(true);

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
          timestamp: Date.now(),
          context: 'route_protection'
        },
        5 // High priority protection
      );
    }

    return () => {
      // Clear timeout on unmount
      if (protectionTimerRef.current) {
        window.clearTimeout(protectionTimerRef.current);
      }
    };
  }, [location.pathname, captureIntent]);

  // Prevention of unwanted redirects
  const isRedirectAllowed = (targetPath: string) => {
    // If protection is active, only allow specific routes
    if (protectionActive) {
      const allowedRoutes = ['/ask-sage', '/auth/login'];
      const isAllowedRoute = allowedRoutes.includes(targetPath);
      
      if (!isAllowedRoute) {
        console.warn(`🚫 Redirect blocked during Ask Sage protection: ${targetPath}`);
        return false;
      }
    }
    return true;
  };

  return {
    protectionActive,
    isRedirectAllowed,
  };
}
