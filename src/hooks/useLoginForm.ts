
import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRedirectIntentManager } from "@/lib/redirect-intent";
import { fetchAuth } from '@/lib/backendAuth';
import { toast } from "@/hooks/use-toast";
import { signIn } from "@/lib/api/authApi";

// Enhance password requirements for clarity (min 6 chars, customizable)
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const { refreshSession } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const loginAttemptRef = useRef<boolean>(false);

  const { activeIntent, executeRedirect, clearIntent } = useRedirectIntentManager();

  // Enable validation on change and blur for real-time feedback
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
    criteriaMode: "all"
  });

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    console.log("📋 LoginForm hook initialized");
    return () => {
      // Reset submission state when component unmounts
      console.log("📋 LoginForm hook cleanup");
      setIsLoading(false);
      setIsSubmitting(false);
    };
  }, []);

  const onSubmit = useCallback(
    async (values: LoginValues): Promise<void> => {
      if (isSubmitting || loginAttemptRef.current) {
        console.log("🛑 Form submission already in progress, preventing duplicate");
        return;
      }
      
      loginAttemptRef.current = true;
      setFormSubmitted(true);
      setIsSubmitting(true);
      console.log("🚀 Login attempt started", { email: values.email });
      setIsLoading(true);
      setAuthError(null);

      try {
        console.log(`🔧 Login process starting with email: ${values.email}, sending to backend API`);
        
        try {
          // Use our centralized auth API with a longer timeout
          const loginResult = await signIn(values.email, values.password);
          console.log("✅ Login API call successful with response:", loginResult);
          
          // Check if the login result was a fallback (HTML response)
          if (loginResult.fallback) {
            console.warn("⚠️ Login API returned HTML instead of JSON - proceeding with caution");
          }
        } catch (fetchError) {
          console.error("⚠️ Login API error:", fetchError);
          setAuthError(fetchError instanceof Error ? fetchError.message : "Login failed. Please try again.");
          setIsLoading(false);
          setIsSubmitting(false);
          loginAttemptRef.current = false;
          return;
        }

        try {
          console.log("🔄 Fetching updated auth state after login");
          // Force fetch auth to ensure we get the latest session after login
          const authData = await fetchAuth({ forceCheck: true });
          
          // Check if we got a fallback empty auth payload
          if (authData?.fallback) {
            console.warn("⚠️ Received fallback auth payload - API may be misconfigured");
            // We still proceed since login was successful, but with limited context
          }
          
          // Explicitly refresh session to update auth context
          if (refreshSession) {
            console.log("🔄 Refreshing session context");
            await refreshSession("post-login");
            console.log("✅ Session refresh completed");
          } else {
            console.warn("⚠️ refreshSession function not available");
          }
          
          // Check if we should redirect based on intent
          if (activeIntent) {
            console.log("🔀 Executing redirect based on stored intent");
            executeRedirect();
          } else {
            console.log("🏠 Redirecting to dashboard");
            navigate("/user-dashboard");
          }
          
          console.log("🎉 Login process completed successfully");
          
        } catch (sessionErr) {
          console.error("❌ Session fetch error:", sessionErr);
          
          // Check if it's a content type error (HTML instead of JSON)
          const isContentTypeError = sessionErr instanceof Error && 
            sessionErr.message.includes('Expected JSON response');
          
          if (isContentTypeError) {
            // This is likely an API configuration issue, but the login may have succeeded
            console.warn("⚠️ API returned HTML instead of JSON. Login may have succeeded, proceeding to dashboard");
            
            // We still try to redirect since login might be successful
            if (activeIntent) {
              executeRedirect();
            } else {
              navigate("/user-dashboard");
            }
          } else {
            // For other errors, show error message
            setAuthError("Authenticated, but failed to load session context. Please try reloading.");
            toast({
              variant: "destructive",
              title: "Session Error",
              description: "Failed to load session context. Please try reloading."
            });
          }
        }
      } catch (err: any) {
        console.error("🔥 Login error caught:", err);
        setAuthError(err.message || "An unexpected error occurred during login.");
        toast({
          variant: "destructive",
          title: "Login Error",
          description: err.message || "An unexpected error occurred"
        });
      } finally {
        setIsLoading(false);
        setIsSubmitting(false);
        loginAttemptRef.current = false;
      }
    },
    [refreshSession, activeIntent, executeRedirect, navigate, isSubmitting]
  );

  return {
    form,
    isLoading,
    authError,
    onSubmit,
    formSubmitted
  };
};
