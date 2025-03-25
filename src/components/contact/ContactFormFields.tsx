
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./schema";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { BetaClientField } from "./BetaClientField";
import { MessageField } from "./MessageField";

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ form }) => {
  return (
    <>
      <PersonalInfoFields form={form} />
      <ContactInfoFields form={form} />
      <BetaClientField form={form} />
      <MessageField form={form} />
    </>
  );
};
