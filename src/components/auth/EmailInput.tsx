
import React from "react";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface EmailInputProps {
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  "aria-required"?: "true" | "false";
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(({
  disabled = false,
  value,
  onChange,
  onBlur,
  name,
  id,
  placeholder,
  className = "",
  "aria-required": ariaRequired,
  ...props
}, ref) => {
  const { t } = useTranslation();
  const defaultPlaceholder = "you@example.com";
  
  return (
    <div className="relative">
      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
      <Input
        type="email"
        placeholder={placeholder || defaultPlaceholder}
        className={`pl-10 font-roboto ${className}`}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        id={id}
        ref={ref}
        aria-required={ariaRequired}
        autoComplete="email"
        {...props}
      />
    </div>
  );
});

EmailInput.displayName = "EmailInput";

export default EmailInput;
