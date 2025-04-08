
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  loadingText?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  children,
  icon: Icon,
  className = "",
  variant = "default",
  loadingText = "Submitting...",
}) => {
  return (
    <Button
      type="submit"
      className={`bg-sagebright-green hover:bg-sagebright-green/90 text-white font-helvetica ${className}`}
      disabled={isSubmitting}
      variant={variant}
      loading={isSubmitting}
      loadingText={loadingText}
    >
      {!isSubmitting && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </Button>
  );
};
