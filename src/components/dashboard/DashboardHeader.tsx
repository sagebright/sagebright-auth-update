
import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function DashboardHeader() {
  const { userId } = useAuth();
  const { user } = useCurrentUser();
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    // Use the user data from the auth context instead of making a separate API call
    setFullName(user?.full_name || null);
  }, [user]);

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
