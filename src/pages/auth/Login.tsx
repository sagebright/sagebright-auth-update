
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
  
  // Use our new redirect intent manager
  const { 
    activeIntent,
    captureIntent,
    executeRedirect,
    clearIntent
  } = useRedirectIntentManager();
  
  // Capture voice parameter from URL if present
  const voiceParam = getVoiceFromUrl(location.search);
  const storedRedirectPath = localStorage.getItem("redirectAfterLogin");

  // On initial mount, check if we need to capture a redirect intent from legacy storage
  useEffect(() => {
    // Handle legacy redirect path from localStorage
    if (storedRedirectPath && !activeIntent) {
      console.log("🔄 Migrating legacy redirect path to intent system:", storedRedirectPath);
      
      // Capture intent with voice parameter if available
      captureIntent(
        storedRedirectPath,
        "auth",
        voiceParam !== 'default' ? { voiceParam } : undefined
      );
      
      // Clear legacy storage
      localStorage.removeItem("redirectAfterLogin");
    }
    
    if (location.search && location.search.includes('voice=')) {
      console.log(`📝 Detected voice parameter in URL: ${voiceParam}`);
    }
  }, [storedRedirectPath, activeIntent, captureIntent, location.search, voiceParam]);

  useEffect(() => {
    if (refreshSession && !loading) {
      console.log("🔄 Login page forcing session refresh");
      refreshSession("login page load");
    }
  }, [refreshSession, loading]);

  // Handle authentication state changes
  useEffect(() => {
    if (loading) {
      console.log("⏳ Auth still loading on login page, waiting...");
      return;
    }

    if (isAuthenticated && user && user.user_metadata && !sessionStableRef.current) {
      console.log("✅ Login page detected stable session with metadata:", {
        role: user.user_metadata?.role || 'unknown',
        orgId: user.user_metadata?.org_id || 'unknown'
      });
      sessionStableRef.current = true;
    }

    // Handle successful authentication and redirection
    if (isAuthenticated && user && sessionStableRef.current && 
        !hasRedirectedRef.current && !redirectInProgressRef.current) {
      
      redirectInProgressRef.current = true;
      hasRedirectedRef.current = true;
      
      const currentTime = Date.now();
      setLoginTimestamp(currentTime);
      
      const timestamp = new Date().toISOString();
      console.log(`✅ [${timestamp}] User authenticated on login page, handling redirect`);
      
      const role = user.user_metadata?.role || 'default';
      const fallbackPath = ROLE_LANDING_PAGES[role as keyof typeof ROLE_LANDING_PAGES] || ROLE_LANDING_PAGES.default;
      
      // Decide where to redirect
      let targetPath: string;
      
      // Check for stored intent first
      if (activeIntent) {
        console.log(`🎯 [${timestamp}] Using stored redirect intent:`, activeIntent.destination);
        targetPath = activeIntent.destination;
        
        // Include any voice parameter from the intent
        if (activeIntent.metadata?.voiceParam && !targetPath.includes('voice=')) {
          const separator = targetPath.includes('?') ? '&' : '?';
          targetPath += `${separator}voice=${activeIntent.metadata.voiceParam}`;
        }
        
        // Clear the intent after use
        clearIntent();
      } 
      // Fall back to role-based default
      else {
        targetPath = fallbackPath;
        console.log(`🎯 [${timestamp}] No stored intent, redirecting to role-based fallback:`, fallbackPath);
      }
      
      toast({
        title: "Welcome back!",
        description: "Redirecting you back...",
      });
      
      // Execute the redirect
      setTimeout(() => {
        if (document.location.pathname.startsWith('/auth')) {
          navigate(targetPath, { replace: true });
          setTimeout(() => {
            redirectInProgressRef.current = false;
          }, 1000);
        }
      }, 100);
    }
  }, [user, isAuthenticated, navigate, toast, loading, activeIntent, clearIntent]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
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
        </div>
      </>
    </AuthLayout>
  );
}
