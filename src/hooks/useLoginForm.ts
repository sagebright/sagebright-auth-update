
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth/AuthContext";
import { syncExistingUsers } from "@/lib/syncExistingUsers";

// Define the login form validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      console.log("🔑 Attempting login with:", data.email);
      
      // Don't attempt to access the return value directly here
      // Let the AuthContext handle the redirection
      await signIn(data.email, data.password);
      
      // The login was successful if we reach this point
      console.log("✅ Login successful");
      
      // Try to sync users after login as an additional safety measure
      // Note: We only try once here since authActions.ts also does this
      try {
        await syncExistingUsers();
        console.log("✅ User sync completed after login");
      } catch (syncError) {
        console.error("⚠️ User sync failed but login succeeded:", syncError);
        // Continue with login flow even if sync fails
      }
      
      // Don't reset isLoading here - this allows the button to stay in loading state
      // until the redirect happens, preventing flashes
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      setAuthError(error.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
      // Reset only the password field, not the email
      form.setValue('password', '');
    }
  };

  return {
    form,
    isLoading,
    authError,
    setAuthError,
    onSubmit,
  };
}
