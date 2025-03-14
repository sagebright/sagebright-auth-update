
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, Alex!</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your onboarding journey today.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-10 w-[150px] md:w-[250px] rounded-md border border-input bg-white px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
