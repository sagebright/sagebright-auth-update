
import React from "react";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * EmailInput props interface
 */
interface EmailInputProps {
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Current input value */
  value: string;
  /** Change event handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur event handler */
  onBlur?: () => void;
  /** Input name attribute */
  name?: string;
  /** Input ID attribute */
  id?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Additional CSS class names */
  className?: string;
  /** ARIA required attribute */
  "aria-required"?: "true" | "false";
}

/**
 * EmailInput - A styled input field for email addresses
 * 
 * Provides a consistent email input with a mail icon and styling that matches
 * the Sagebright design system.
 *
 * @example
 * ```tsx
 * <EmailInput
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   placeholder="Enter your email"
 * />
 * ```
 * 
 * @accessibility Uses appropriate aria attributes for improved accessibility
 */
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
