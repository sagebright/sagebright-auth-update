
import React from 'react';
import { Input } from '@/components/ui/input';

interface EmailInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  placeholder?: string;
  name: string;
  id: string;
  className?: string;
  required?: boolean;
  'aria-required'?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = 'Enter your email',
  name,
  id,
  className = '',
  required,
  'aria-required': ariaRequired,
  ...props
}) => {
  return (
    <Input
      type="email"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={`bg-white ${className}`}
      required={required}
      aria-required={ariaRequired}
      autoComplete="email"
      {...props}
    />
  );
};

export default EmailInput;
