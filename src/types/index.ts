
/**
 * Shared type definitions for the Sagebright application
 */

// Auth types
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordValues {
  email: string;
}

// UI component props types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

// Language/i18n types
export interface Language {
  code: string;
  name: string;
  flag: string;
}

// Form field types
export interface SelectOption {
  value: string;
  label: string;
}

export type IconType = "mail" | "user" | "search" | "none";
