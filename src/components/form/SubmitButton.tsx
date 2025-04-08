
import React from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { LucideIcon } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link" | "accent1" | "accent2" | "charcoal";
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  children,
  icon: Icon,
  className = "",
  variant = "default",
}) => {
  return (
    <LoadingButton
      type="submit"
      className={`bg-sagebright-green hover:bg-sagebright-green/90 text-white font-helvetica ${className}`}
      disabled={isSubmitting}
      isLoading={isSubmitting}
      loadingText="Submitting..."
      variant={variant}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </LoadingButton>
  );
};
