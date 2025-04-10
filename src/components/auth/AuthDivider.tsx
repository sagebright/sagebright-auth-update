
import React from "react";

const AuthDivider = () => {
  return (
    <div className="relative flex items-center py-5">
      <div className="flex-grow border-t border-border"></div>
      <span className="flex-shrink-0 mx-4 text-xs uppercase text-muted-foreground bg-background px-3">
        Or continue with email
      </span>
      <div className="flex-grow border-t border-border"></div>
    </div>
  );
};

export default AuthDivider;
