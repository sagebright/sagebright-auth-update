
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";

const AuthDivider = () => {
  const { t } = useTranslation();
  
  return (
    <div className="relative flex items-center justify-center py-5" role="separator" aria-orientation="horizontal">
      <Separator className="absolute left-0 right-0 w-full" />
      <span className="flex-shrink-0 px-4 text-xs uppercase text-muted-foreground bg-background relative z-10">
        {t('common.continueWithEmail') as string}
      </span>
    </div>
  );
};

export default AuthDivider;
