
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginForm from "@/components/auth/LoginForm";
import { useToast } from "@/hooks/use-toast";
import { useRedirectIntentManager } from "@/lib/redirect-intent";
import { getVoiceFromUrl } from "@/lib/utils";

const ROLE_LANDING_PAGES = {
  admin: '/hr-dashboard',
  user: '/user-dashboard',
  default: '/user-dashboard'
};

export default function Login() {
  const { signInWithGoogle, user, isAuthenticated, loading, orgId, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { form, isLoading, authError, onSubmit } = useLoginForm();
  const { toast } = useToast();
  const hasRedirectedRef = useRef(false);
  const redirectInProgressRef = useRef(false);
  const [loginTimestamp, setLoginTimestamp] = useState<number | null>(null);
  const sessionStableRef = useRef(false);
  
  // Use our redirect intent manager with enhanced logging
  const { 
    activeIntent,
    captureIntent,
    executeRedirect,
    clearIntent,
    status: intentStatus
  } = useRedirectIntentManager({
    enableLogging: true,
    defaultPriority: 1 // Set higher default priority for auth-related intents
  });
  
  // Capture voice parameter from URL if present
  const voiceParam = getVoiceFromUrl(location.search);
  const storedRedirectPath = localStorage.getItem("redirectAfterLogin");

  // On initial mount, check if we need to capture a redirect intent from legacy storage
  useEffect(() => {
    // Track login page visits for debugging
    console.log(`🔒 Login page mounted at ${new Date().toISOString()} [auth: ${isAuthenticated}] [intent: ${activeIntent?.destination || 'none'}]`);
    
    // Enhanced migration of legacy redirect path to intent system
    if (storedRedirectPath && !activeIntent) {
      console.log("🔄 Migrating legacy redirect path to intent system:", {
        path: storedRedirectPath,
        voice: voiceParam
      });
      
      // Create metadata with additional context
      const metadata = {
        source: 'legacy_storage',
        context: 'login_migration',
        timestamp: Date.now(),
        voiceParam: voiceParam !== 'default' ? voiceParam : undefined
      };
      
      // Set a higher priority (2) for redirects originated from explicit user navigation
      captureIntent(
        storedRedirectPath,
        "auth",
        metadata,
        2 // Higher priority for user-driven redirects
      );
      
      // Clear legacy storage after migration
      localStorage.removeItem("redirectAfterLogin");
    }
    
    // Capture voice parameter if present but no active intent
    if (!activeIntent && location.search && location.search.includes('voice=') && voiceParam !== 'default') {
      console.log(`📝 Detected voice parameter in URL without intent: ${voiceParam}`);
      
      // Store voice param for future use
      localStorage.setItem("voiceParameter", voiceParam);
    }
  }, [storedRedirectPath, activeIntent, captureIntent, location.search, voiceParam, isAuthenticated]);

  // Force session refresh when login page loads
  useEffect(() => {
    if (refreshSession && !loading) {
      console.log("🔄 Login page forcing session refresh");
      refreshSession("login page load");
    }
  }, [refreshSession, loading]);

  // Handle authentication state changes with enhanced intent awareness
  useEffect(() => {
    if (loading) {
      console.log("⏳ Auth still loading on login page, waiting...");
      return;
    }

    // Track session stability for reliable redirects
    if (isAuthenticated && user && user.user_metadata && !sessionStableRef.current) {
      console.log("✅ Login page detected stable session with metadata:", {
        role: user.user_metadata?.role || 'unknown',
        orgId: user.user_metadata?.org_id || 'unknown',
        intentStatus,
        activeIntent: activeIntent?.destination
      });
      sessionStableRef.current = true;
    }

    // Enhanced redirect logic with intent prioritization
    if (isAuthenticated && user && sessionStableRef.current && 
        !hasRedirectedRef.current && !redirectInProgressRef.current) {
      
      redirectInProgressRef.current = true;
      hasRedirectedRef.current = true;
      
      const currentTime = Date.now();
      setLoginTimestamp(currentTime);
      
      const timestamp = new Date().toISOString();
      console.log(`✅ [${timestamp}] User authenticated on login page, handling redirect with intent status: ${intentStatus}`);
      
      const role = user.user_metadata?.role || 'default';
      const fallbackPath = ROLE_LANDING_PAGES[role as keyof typeof ROLE_LANDING_PAGES] || ROLE_LANDING_PAGES.default;
      
      // Decide where to redirect with clearer priority system
      let targetPath: string;
      
      // HIGHEST PRIORITY: Check for stored intent first
      if (activeIntent) {
        console.log(`🎯 [${timestamp}] Using stored redirect intent:`, {
          destination: activeIntent.destination,
          intentId: activeIntent.metadata?.intentId,
          reason: activeIntent.reason,
          priority: activeIntent.priority,
          age: Date.now() - activeIntent.timestamp
        });
        
        targetPath = activeIntent.destination;
        
        // Include any voice parameter from the intent
        if (activeIntent.metadata?.voiceParam && !targetPath.includes('voice=')) {
          const separator = targetPath.includes('?') ? '&' : '?';
          targetPath += `${separator}voice=${activeIntent.metadata.voiceParam}`;
          console.log(`🎤 Adding voice parameter to redirect: ${activeIntent.metadata.voiceParam}`);
        }
        
        // Clear the intent after use to prevent future interference
        clearIntent();
      } 
      // LOWER PRIORITY: Special case to prioritize Ask Sage if it's the target
      else if (storedRedirectPath === '/ask-sage') {
        targetPath = '/ask-sage';
        console.log(`🎯 [${timestamp}] Special case: prioritizing /ask-sage redirect`);
        
        // Add voice param if stored
        const storedVoice = localStorage.getItem("voiceParameter");
        if (storedVoice && storedVoice !== 'default') {
          targetPath += `?voice=${storedVoice}`;
        }
        
        // Clean up
        localStorage.removeItem("storedRedirectPath");
      }
      // LOWEST PRIORITY: Fall back to role-based default
      else {
        targetPath = fallbackPath;
        console.log(`🎯 [${timestamp}] No stored intent, redirecting to role-based fallback:`, {
          role,
          path: fallbackPath
        });
      }
      
      toast({
        title: "Welcome back!",
        description: "Redirecting you back...",
      });
      
      // Execute the redirect with more careful timing
      setTimeout(() => {
        // Double-check we're still on auth page to prevent race conditions
        if (document.location.pathname.startsWith('/auth')) {
          console.log(`🚀 [${new Date().toISOString()}] Executing post-login redirect to: ${targetPath}`);
          navigate(targetPath, { replace: true });
          setTimeout(() => {
            redirectInProgressRef.current = false;
          }, 1000);
        } else {
          console.log(`⚠️ Aborting redirect - already navigated away from /auth`);
        }
      }, 100);
    }
  }, [user, isAuthenticated, navigate, toast, loading, activeIntent, clearIntent, intentStatus]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }
  
  if (isAuthenticated && user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Redirecting to dashboard...</span>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Sign in"
      heading="Welcome back"
      subheading="Sign in to your account"
      footer={
        <p className="text-sm text-gray-600 font-roboto">
          New user accounts can only be created by an administrator.
        </p>
      }
    >
      <>{/* Description */}
        Enter your credentials to sign in to your account
      </>
      
      <>{/* Content */}
        <div className="space-y-4">
          <GoogleSignInButton onClick={handleGoogleSignIn} />
          
          <AuthDivider />
          
          <LoginForm 
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            authError={authError}
          />
          
          {activeIntent && (
            <div className="text-xs text-gray-500 mt-2 italic">
              You'll be redirected to your last location after signing in.
            </div>
          )}
        </div>
      </>
    </AuthLayout>
  );
}
