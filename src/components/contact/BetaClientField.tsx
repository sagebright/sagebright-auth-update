
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./schema";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface BetaClientFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export const BetaClientField: React.FC<BetaClientFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="isBetaClient"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-sagebright-green data-[state=checked]:border-sagebright-green"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <p className="text-charcoal text-sm">
              I am a current beta client
            </p>
          </div>
        </FormItem>
      )}
    />
  );
};
