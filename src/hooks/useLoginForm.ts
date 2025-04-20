
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRedirectIntentManager } from "@/lib/redirect-intent";
import { fetchAuth } from '@/lib/backendAuth';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { activeIntent, executeRedirect, clearIntent } = useRedirectIntentManager();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (values: LoginValues): Promise<void> => {
      setIsLoading(true);
      setAuthError(null);

      try {
        // Step 1: POST /api/auth/login
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
          // Attempt to get error from response, else fallback
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

        // Step 2: GET /api/auth/session, hydrate context
        try {
          await fetchAuth();
        } catch (sessionErr) {
          setAuthError("Authenticated, but failed to load session context. Please try reloading.");
          handleApiError(sessionErr, { context: "session-fetch", showToast: true });
          return;
        }

        // Optionally, you could toast or log success here if you want

      } catch (err: any) {
        const apiErr = handleApiError(err, { context: "login", showToast: true });
        setAuthError(apiErr.message || "An unexpected error occurred during login.");
        console.error('Login error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    form,
    isLoading,
    authError,
    onSubmit,
  };
};
