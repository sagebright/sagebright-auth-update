
import React from "react";
import { Separator } from "@/components/ui/separator";

const AuthDivider = () => {
  return (
    <div className="relative flex items-center py-5">
      <Separator className="flex-grow" />
      <span className="flex-shrink-0 mx-4 text-xs uppercase text-muted-foreground bg-background px-3">
        Or continue with email
      </span>
      <Separator className="flex-grow" />
    </div>
  );
};

export default AuthDivider;
