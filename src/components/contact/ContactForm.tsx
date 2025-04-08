
import React from "react";
import { Form } from "@/components/ui/form";
import { useContactForm } from "./useContactForm";
import { Send } from "lucide-react";
import {
  TextField,
  TextareaField,
  CheckboxField,
  SubmitButton
} from "@/components/form";

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
          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              form={form}
              name="firstName"
              placeholder="First Name"
            />
            
            <TextField
              form={form}
              name="lastName"
              placeholder="Last Name"
            />
          </div>
          
          <TextField
            form={form}
            name="email"
            placeholder="Email Address"
            icon="mail"
          />
          
          <TextField
            form={form}
            name="company"
            placeholder="Company (optional)"
          />
          
          <CheckboxField
            form={form}
            name="isBetaClient"
            label="I am a current beta client"
          />
          
          <TextareaField
            form={form}
            name="message"
            placeholder="What's on your mind?"
            rows={6}
          />
          
          <SubmitButton isSubmitting={isSubmitting} icon={Send}>
            Send Message
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
