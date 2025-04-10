
import React from "react";

const AuthDivider = () => {
  return (
    <div className="relative flex items-center py-5">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink-0 mx-4 text-xs uppercase text-gray-500 bg-white px-3">
        Or continue with email
      </span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default AuthDivider;
