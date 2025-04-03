
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { contactFormSchema, ContactFormValues } from "./schema";

interface UseContactFormProps {
  onSubmitSuccess?: () => void;
}

export function useContactForm({ onSubmitSuccess }: UseContactFormProps = {}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Submit data to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          company: data.company || null,
          is_beta_client: data.isBetaClient,
          message: data.message
        });
      
      if (error) {
        console.error("Error submitting form:", error);
        toast({
          title: "Something went wrong",
          description: "Your message could not be sent. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll be in touch soon.",
        duration: 5000,
      });
      
      // Reset form
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        isBetaClient: false,
        message: "",
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Your message could not be sent. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
