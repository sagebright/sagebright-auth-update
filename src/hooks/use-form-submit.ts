
import { useState, useCallback } from "react";
import { handleApiError } from "@/lib/handleApiError";
import { toast } from "@/components/ui/use-toast";

interface UseFormSubmitOptions<T, R> {
  onSubmit: (data: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  successMessage?: string;
  errorMessage?: string;
  resetFormOnSuccess?: boolean;
}

export function useFormSubmit<T, R = any>({
  onSubmit,
  onSuccess,
  successMessage = "Form submitted successfully",
  errorMessage = "There was an error submitting the form",
  resetFormOnSuccess = true,
}: UseFormSubmitOptions<T, R>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (data: T, formReset?: () => void) => {
      setIsSubmitting(true);
      try {
        const result = await onSubmit(data);
        
        // Show success message
        toast({
          title: "Success",
          description: successMessage
        });
        
        if (resetFormOnSuccess && formReset) {
          formReset();
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (error) {
        // Use our centralized error handling
        handleApiError(error, {
          context: "form submission",
          fallbackMessage: errorMessage
        });
        
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, onSuccess, successMessage, errorMessage, resetFormOnSuccess]
  );

  return {
    isSubmitting,
    handleSubmit,
  };
}
