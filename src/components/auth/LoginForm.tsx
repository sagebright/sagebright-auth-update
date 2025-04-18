
import React from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { LoginValues } from "@/hooks/useLoginForm";
import { UseFormReturn } from "react-hook-form";
import PasswordInput from "./PasswordInput";
import EmailInput from "./EmailInput";
import { Link } from "react-router-dom";
import { FocusRing } from "@/components/ui/accessibility";

interface LoginFormProps {
  form: UseFormReturn<LoginValues>;
  onSubmit: (values: LoginValues) => Promise<void>;
  isLoading: boolean;
  authError: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  form,
  onSubmit,
  isLoading,
  authError,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Login form">
        {authError && (
          <div 
            className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md" 
            role="alert"
            aria-live="assertive"
          >
            {authError}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-helvetica" htmlFor="email">Email</FormLabel>
              <FormControl>
                <FocusRing>
                  <EmailInput
                    disabled={isLoading}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    id="email"
                    aria-required="true"
                  />
                </FocusRing>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-helvetica" htmlFor="password">Password</FormLabel>
              <FormControl>
                <FocusRing>
                  <PasswordInput
                    disabled={isLoading}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    id="password"
                    aria-required="true"
                  />
                </FocusRing>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 font-helvetica"
          disabled={isLoading}
          loading={isLoading}
          loadingText="Signing in..."
        >
          {!isLoading && (
            <>
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Sign in
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
