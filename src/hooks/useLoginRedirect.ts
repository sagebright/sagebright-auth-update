
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRedirectIntentManager } from "@/lib/redirect-intent";
import { getVoiceFromUrl } from "@/lib/utils";

// Role-based landing pages mapping
export const ROLE_LANDING_PAGES = {
  admin: '/hr-dashboard',
  user: '/user-dashboard',
  default: '/user-dashboard'
};

// Debounce logging
let lastLoginRedirectLog = 0;
const LOGIN_LOG_THROTTLE = 10000; // 10 seconds to reduce spam

export function useLoginRedirect() {
  const { user, isAuthenticated, loading, orgId, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const hasRedirectedRef = useRef(false);
  const redirectInProgressRef = useRef(false);
  const [loginTimestamp, setLoginTimestamp] = useState<number | null>(null);
  const sessionStableRef = useRef(false);
  const checkAttemptedRef = useRef(false);
  const refreshAttemptedRef = useRef(false);
  
  const { 
    activeIntent,
    captureIntent,
    executeRedirect,
    clearIntent,
    status: intentStatus
  } = useRedirectIntentManager({
    enableLogging: false, // Disable verbose intent logging
    defaultPriority: 1
  });
  
  const voiceParam = getVoiceFromUrl(location.search);
  const storedRedirectPath = localStorage.getItem("redirectAfterLogin");

  // Conditionally log based on time
  const logIfNeeded = (message: string, data?: any) => {
    const now = Date.now();
    if (now - lastLoginRedirectLog > LOGIN_LOG_THROTTLE) {
      lastLoginRedirectLog = now;
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
      return true;
    }
    return false;
  };

  // Handle legacy redirect path once on mount
  useEffect(() => {
    const isInitialMount = !checkAttemptedRef.current;
    
    if (isInitialMount) {
      logIfNeeded(`🔒 Login page mounted at ${new Date().toISOString()} [auth: ${isAuthenticated}] [intent: ${activeIntent?.destination || 'none'}]`);
      
      checkAttemptedRef.current = true;
      
      if (storedRedirectPath && !activeIntent) {
        logIfNeeded("🔄 Migrating legacy redirect path to intent system:", {
          path: storedRedirectPath,
          voice: voiceParam
        });
        
        const metadata = {
          source: 'legacy_storage',
          context: 'login_migration',
          timestamp: Date.now(),
          voiceParam: voiceParam !== 'default' ? voiceParam : undefined
        };
        
        captureIntent(
          storedRedirectPath,
          "auth",
          metadata,
          2
        );
        
        localStorage.removeItem("redirectAfterLogin");
      }
      
      if (!activeIntent && location.search && location.search.includes('voice=') && voiceParam !== 'default') {
        logIfNeeded(`📝 Detected voice parameter in URL without intent: ${voiceParam}`);
        localStorage.setItem("voiceParameter", voiceParam);
      }
    }
  }, [storedRedirectPath, activeIntent, captureIntent, location.search, voiceParam, isAuthenticated]);

  // Force session refresh ONLY ONCE on page load
  useEffect(() => {
    // Only do this once per component mount
    if (refreshSession && !refreshAttemptedRef.current && !loading) {
      refreshAttemptedRef.current = true;
      logIfNeeded("🔄 Login page forcing one-time session refresh");
      refreshSession("login page load").catch(err => {
        console.error("Session refresh error:", err);
      });
    }
  }, [refreshSession, loading]);

  // Handle authenticated state and redirection
  useEffect(() => {
    if (loading) {
      // Only log "still loading" once per threshold period
      if (isAuthenticated === false && logIfNeeded("⏳ Auth still loading on login page, waiting...")) {
        // Only log this message occasionally
      }
      return;
    }
    
    // Skip if already redirected or in progress
    if (hasRedirectedRef.current || redirectInProgressRef.current) {
      return;
    }
    
    // Check for stable session once
    if (isAuthenticated && user && user.user_metadata && !sessionStableRef.current) {
      logIfNeeded("✅ Login page detected stable session with metadata:", {
        role: user.user_metadata?.role || 'unknown',
        orgId: user.user_metadata?.org_id || 'unknown',
        intentStatus,
        activeIntent: activeIntent?.destination
      });
      sessionStableRef.current = true;
    }
    
    // Only redirect if authenticated with stable session
    if (isAuthenticated && user && sessionStableRef.current) {
      redirectInProgressRef.current = true;
      hasRedirectedRef.current = true;
      const currentTime = Date.now();
      setLoginTimestamp(currentTime);
      const timestamp = new Date().toISOString();
      console.log(`✅ [${timestamp}] User authenticated on login page, handling redirect with intent status: ${intentStatus}`);
      
      const role = user.user_metadata?.role || 'default';
      const fallbackPath = ROLE_LANDING_PAGES[role as keyof typeof ROLE_LANDING_PAGES] || ROLE_LANDING_PAGES.default;
      let targetPath: string;
      
      if (activeIntent) {
        logIfNeeded(`🎯 [${timestamp}] Using stored redirect intent:`, {
          destination: activeIntent.destination,
          intentId: activeIntent.metadata?.intentId,
          reason: activeIntent.reason,
          priority: activeIntent.priority,
          age: Date.now() - activeIntent.timestamp
        });
        targetPath = activeIntent.destination;
        if (activeIntent.metadata?.voiceParam && !targetPath.includes('voice=')) {
          const separator = targetPath.includes('?') ? '&' : '?';
          targetPath += `${separator}voice=${activeIntent.metadata.voiceParam}`;
          logIfNeeded(`🎤 Adding voice parameter to redirect: ${activeIntent.metadata.voiceParam}`);
        }
        clearIntent();
      } else if (storedRedirectPath === '/ask-sage') {
        targetPath = '/ask-sage';
        logIfNeeded(`🎯 [${timestamp}] Special case: prioritizing /ask-sage redirect`);
        const storedVoice = localStorage.getItem("voiceParameter");
        if (storedVoice && storedVoice !== 'default') {
          targetPath += `?voice=${storedVoice}`;
        }
        localStorage.removeItem("storedRedirectPath");
      } else {
        targetPath = fallbackPath;
        logIfNeeded(`🎯 [${timestamp}] No stored intent, redirecting to role-based fallback:`, {
          role,
          path: fallbackPath
        });
      }
      
      toast({
        title: "Welcome back!",
        description: "Redirecting you back...",
      });
      
      // Use a normal timeout rather than setTimeout to prevent potential loops
      const timeoutMs = 100;
      const redirectTimeout = window.setTimeout(() => {
        if (document.location.pathname.startsWith('/auth')) {
          console.log(`🚀 [${new Date().toISOString()}] Executing post-login redirect to: ${targetPath}`);
          navigate(targetPath, { replace: true });
          
          // Allow a cooling period before enabling redirects again
          const clearRedirectTimeout = window.setTimeout(() => {
            redirectInProgressRef.current = false;
            window.clearTimeout(clearRedirectTimeout);
          }, 1000);
        } else {
          logIfNeeded(`⚠️ Aborting redirect - already navigated away from /auth`);
          redirectInProgressRef.current = false;
        }
        window.clearTimeout(redirectTimeout);
      }, timeoutMs);
    }
  }, [user, isAuthenticated, navigate, toast, loading, activeIntent, clearIntent, intentStatus]);

  return {
    isAuthenticated,
    user,
    loading,
    activeIntent,
  };
}
