
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRedirectIntentManager } from "@/lib/redirect-intent";
import { fetchAuth } from '@/lib/backendAuth';

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

  const onSubmit = useCallback(
    async (values: LoginValues): Promise<void> => {
      setIsLoading(true);
      setAuthError(null);

      try {
        const BASE = import.meta.env.VITE_BACKEND_URL || "";
        const loginRes = await fetch(`${BASE}/api/auth/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        if (!loginRes.ok) {
          let errorMsg = 'Login failed';
          try {
            const data = await loginRes.json();
            errorMsg = data.error || data.message || errorMsg;
          } catch {
            // fallback
          }
          setAuthError(errorMsg);
          handleApiError(new Error(errorMsg), { context: "login", showToast: true });
          return;
        }

        try {
          // Force fetch auth to ensure we get the latest session after login
          await fetchAuth({ forceCheck: true });
          
          // Explicitly refresh session to update auth context
          if (refreshSession) {
            refreshSession("post-login");
          }
        } catch (sessionErr) {
          setAuthError("Authenticated, but failed to load session context. Please try reloading.");
          handleApiError(sessionErr, { context: "session-fetch", showToast: true });
          return;
        }
      } catch (err: any) {
        const apiErr = handleApiError(err, { context: "login", showToast: true });
        setAuthError(apiErr.message || "An unexpected error occurred during login.");
        console.error('Login error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshSession]
  );

  return {
    form,
    isLoading,
    authError,
    onSubmit,
  };
};
