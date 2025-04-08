
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  children,
  icon: Icon,
  className = "",
  variant = "default",
}) => {
  return (
    <Button
      type="submit"
      className={`bg-sagebright-green hover:bg-sagebright-green/90 text-white font-helvetica ${className}`}
      disabled={isSubmitting}
      variant={variant}
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
          <span>Submitting...</span>
        </div>
      ) : (
        <div className="flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          {children}
        </div>
      )}
    </Button>
  );
};
