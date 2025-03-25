
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./schema";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface MessageFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export const MessageField: React.FC<MessageFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea 
              placeholder="What's on your mind?" 
              className="min-h-[150px] border-sagebright-accent/30 focus-visible:ring-sagebright-green text-gray-500" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
