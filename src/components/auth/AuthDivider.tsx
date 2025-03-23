
import React from "react";

const AuthDivider = () => {
  return (
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">
        Or continue with email
      </span>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t"></span>
      </div>
    </div>
  );
};

export default AuthDivider;
