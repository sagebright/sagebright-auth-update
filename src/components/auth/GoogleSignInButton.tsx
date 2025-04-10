
import React from "react";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface GoogleSignInButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, isLoading = false }) => {
  return (
    <Button 
      variant="outline" 
      type="button" 
      className="w-full font-roboto"
      onClick={onClick}
      loading={isLoading}
      loadingText="Connecting to Google..."
      aria-label="Sign in with Google"
    >
      <Chrome className="mr-2 h-4 w-4" aria-hidden="true" />
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
