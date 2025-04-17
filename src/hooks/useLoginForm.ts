
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import { toast } from "@/hooks/use-toast";
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

  const onSubmit = useCallback(async (values: LoginValues): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const BASE = import.meta.env.VITE_BACKEND_URL || '';
      
      // Call the login endpoint
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: values.email, 
          password: values.password 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      // Hydrate the auth context with the new session
      await fetchAuth();
      
      // Show success toast and handle redirect based on intent
      if (activeIntent) {
        console.log("🎯 Intent-based redirect after login:", activeIntent.destination);
        
        toast({
          title: "Login successful",
          description: "Redirecting you to your last location...",
        });
      } else {
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user-dashboard";
        localStorage.removeItem("redirectAfterLogin");
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        console.log("🔄 Legacy redirect after login:", redirectPath);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAuthError(message);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeIntent]);

  return {
    form,
    isLoading,
    authError,
    onSubmit,
  };
};

