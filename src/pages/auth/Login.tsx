
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginForm from "@/components/auth/LoginForm";
import { getOrgFromUrl } from "@/lib/subdomainUtils";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { signInWithGoogle, user, isAuthenticated, loading, orgId, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { form, isLoading, authError, onSubmit } = useLoginForm();
  const { toast } = useToast();
  const hasRedirectedRef = useRef(false);
  const redirectInProgressRef = useRef(false);
  const [loginTimestamp, setLoginTimestamp] = useState<number | null>(null);
  
  // Get the stored redirect path or default to dashboard
  const redirectPath = localStorage.getItem("redirectAfterLogin") || "/ask-sage";
  
  // Check if we need to preserve query parameters (e.g., voice param)
  const preserveSearch = localStorage.getItem("preserveSearchParams") || "";
  
  // Force session refresh on login page load
  useEffect(() => {
    if (refreshSession && !loading) {
      console.log("🔄 Login page forcing session refresh");
      refreshSession("login page load");
    }
  }, [refreshSession, loading]);

  useEffect(() => {
    // Store the current search parameters if coming from a page with voice param
    if (location.search && location.search.includes('voice=') && !localStorage.getItem("preserveSearchParams")) {
      localStorage.setItem("preserveSearchParams", location.search);
      const timestamp = new Date().toISOString();
      console.log(`📝 [${timestamp}] Stored search params for post-login redirect:`, {
        search: location.search,
        storedPath: localStorage.getItem("redirectAfterLogin"),
        voiceParam: new URLSearchParams(location.search).get('voice')
      });
    }
    
    // If auth is still loading, don't do anything yet
    if (loading) {
      console.log("⏳ Auth still loading on login page, waiting...");
      return;
    }

    // If user is already authenticated, redirect them appropriately
    if (isAuthenticated && user && !hasRedirectedRef.current && !redirectInProgressRef.current) {
      redirectInProgressRef.current = true;
      hasRedirectedRef.current = true;
      
      // Record login timestamp to detect potential redirect loops
      const currentTime = Date.now();
      setLoginTimestamp(currentTime);
      
      const timestamp = new Date().toISOString();
      console.log(`✅ [${timestamp}] User already authenticated on login page, redirecting to dashboard`);
      
      // Check the role specifically from user_metadata
      const role = user.user_metadata?.role || 'user';
      let targetPath = role === 'admin' ? '/hr-dashboard' : '/ask-sage';
      
      // Check if we should redirect to a stored path
      if (localStorage.getItem("redirectAfterLogin")) {
        targetPath = localStorage.getItem("redirectAfterLogin") || targetPath;
        
        // Append preserved search params if they exist
        const searchParams = localStorage.getItem("preserveSearchParams");
        if (searchParams && !targetPath.includes('?')) {
          targetPath += searchParams;
          console.log(`🔄 [${timestamp}] Restoring search params to redirect:`, {
            targetPath,
            originalSearch: searchParams,
            voiceParam: new URLSearchParams(searchParams).get('voice')
          });
        }
      }
      
      console.log(`🎯 [${timestamp}] Redirecting to:`, targetPath, "based on role:", role);
      
      // Show a toast for redirection
      toast({
        title: "Already signed in",
        description: "Redirecting to your dashboard...",
      });
      
      // Clear any stored redirect paths to prevent loops
      localStorage.removeItem("redirectAfterLogin");
      localStorage.removeItem("preserveSearchParams");
      
      // Use setTimeout to ensure we're not redirecting within another React effect cycle
      // Increased timeout to ensure auth state is settled
      setTimeout(() => {
        if (document.location.pathname.startsWith('/auth')) {
          navigate(targetPath, { replace: true });
          redirectInProgressRef.current = false;
        }
      }, 300);
    }
  }, [user, isAuthenticated, loading, orgId, navigate, toast, location.search]);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The redirect will be handled by the AuthContext after successful Google sign-in
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  // If still loading auth state, show a loading indicator
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }
  
  // If already authenticated, show a loading indicator instead of a flash of the login page
  if (isAuthenticated && user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Redirecting to dashboard...</span>
      </div>
    );
  }

  // Only render the login form if the user is not authenticated
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
