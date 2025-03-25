
import React from "react";
import { Form } from "@/components/ui/form";
import { useContactForm } from "./useContactForm";
import { ContactFormFields } from "./ContactFormFields";
import { SubmitButton } from "./SubmitButton";

type ContactFormProps = {
  onSubmitSuccess?: () => void;
};

const ContactForm = ({ onSubmitSuccess }: ContactFormProps) => {
  const { form, isSubmitting, onSubmit } = useContactForm({ 
    onSubmitSuccess 
  });

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <ContactFormFields form={form} />
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
