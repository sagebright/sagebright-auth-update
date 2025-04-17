
import React, { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import { useSageContext } from "@/hooks/sage-context";

export default function DashboardHeader() {
  const sageContext = useSageContext();
  const { userContext, loading } = sageContext;
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!userContext) return;
    
    // Use the user data from the context hook
    setFullName(userContext?.name || null);
  }, [userContext]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const firstName = fullName ? fullName.split(" ")[0] : "there";

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="space-y-0.5">
        <h1 className="font-helvetica text-3xl font-bold tracking-tight text-charcoal">
          Good {getTimeOfDay()}, {firstName}.
        </h1>
        <p className="font-roboto text-lg text-charcoal/70">
          Let's make today count.
        </p>
      </div>
      <div>
        <UserMenu />
      </div>
    </div>
  );
}
