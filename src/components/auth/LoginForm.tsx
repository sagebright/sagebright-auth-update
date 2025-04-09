
import React from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { LoginValues } from "@/hooks/useLoginForm";
import { UseFormReturn } from "react-hook-form";
import PasswordInput from "./PasswordInput";
import EmailInput from "./EmailInput";
import { Link } from "react-router-dom";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {authError && (
          <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
            {authError}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-helvetica">Email</FormLabel>
              <FormControl>
                <EmailInput
                  disabled={isLoading}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
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
              <FormLabel className="font-helvetica">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  disabled={isLoading}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-sagebright-green hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-sagebright-green hover:bg-sagebright-green/90 font-helvetica"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
              Signing in...
            </div>
          ) : (
            <div className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
