
import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="pt-4">
      <Button 
        type="submit" 
        className="bg-sagebright-green hover:bg-sagebright-green/90 text-white w-full sm:w-auto"
        disabled={isSubmitting}
      >
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </div>
  );
};
