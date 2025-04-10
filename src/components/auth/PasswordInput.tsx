
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
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

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({
  disabled = false,
  value,
  onChange,
  onBlur,
  name,
  id,
  placeholder = "••••••••",
  className = "",
  "aria-required": ariaRequired,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleBtnId = `${id || name}-toggle`;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`pr-10 font-roboto ${className}`}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        id={id}
        ref={ref}
        aria-required={ariaRequired}
        autoComplete="current-password"
        aria-describedby={toggleBtnId}
        {...props}
      />
      <button
        type="button"
        id={toggleBtnId}
        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={0}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
