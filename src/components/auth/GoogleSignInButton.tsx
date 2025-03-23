
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
      disabled={isLoading}
    >
      <Chrome className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
