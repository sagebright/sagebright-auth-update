
import React from "react";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface GoogleSignInButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  onClick, 
  isLoading = false 
}) => {
  const { t } = useTranslation();
  
  return (
    <Button 
      variant="outline" 
      type="button" 
      className="w-full font-roboto"
      onClick={onClick}
      loading={isLoading}
      loadingText={t('common.loading') as string}
      aria-label={t('common.continueWithGoogle') as string}
    >
      <Chrome className="mr-2 h-4 w-4" aria-hidden="true" />
      {t('common.continueWithGoogle') as string}
    </Button>
  );
};

export default GoogleSignInButton;
