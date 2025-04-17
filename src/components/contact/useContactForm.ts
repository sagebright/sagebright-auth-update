import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAuth } from '@/lib/backendAuth';
import { contactFormSchema, ContactFormValues } from "./schema";
import { useFormSubmit } from "@/hooks/use-form-submit";

interface UseContactFormProps {
  onSubmitSuccess?: () => void;
}

export function useContactForm({ onSubmitSuccess }: UseContactFormProps = {}) {
  // Initialize form with default values
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      isBetaClient: false,
      message: "",
    },
  });

  // Form submission handler using our custom hook
  const submitToSupabase = async (data: ContactFormValues) => {
    // Submit data to Supabase
    const { error, data: result } = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            company: data.company || null,
            is_beta_client: data.isBetaClient,
            message: data.message
        })
    }).then(res => res.json());
      
    if (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
    
    return result;
  };

  const { isSubmitting, handleSubmit } = useFormSubmit<ContactFormValues>({
    onSubmit: submitToSupabase,
    onSuccess: () => {
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    },
    successMessage: "Thank you for reaching out. We'll be in touch soon.",
    errorMessage: "Your message could not be sent. Please try again later.",
    resetFormOnSuccess: true,
  });

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit((data) => handleSubmit(data, form.reset))
  };
}
