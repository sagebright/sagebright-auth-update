
import React from "react";

export default function DashboardHeader() {
  // Get current time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="space-y-0.5">
        <h1 className="font-helvetica text-3xl font-bold tracking-tight text-charcoal">
          Good {getTimeOfDay()}, Adam
        </h1>
        <p className="font-roboto text-lg text-charcoal/70">
          Let's make today count.
        </p>
      </div>
    </div>
  );
}
