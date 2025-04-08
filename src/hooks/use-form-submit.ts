
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/handleApiError";

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
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (data: T, formReset?: () => void) => {
      setIsSubmitting(true);
      try {
        const result = await onSubmit(data);
        
        toast({
          title: "Success",
          description: successMessage,
          duration: 5000,
        });
        
        if (resetFormOnSuccess && formReset) {
          formReset();
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (error) {
        handleApiError(error, {
          context: "form submission",
          fallbackMessage: errorMessage
        });
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
        
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, onSuccess, successMessage, errorMessage, resetFormOnSuccess, toast]
  );

  return {
    isSubmitting,
    handleSubmit,
  };
}
