
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import SagePicksSection from "@/components/dashboard/SagePicksSection";
import JustForFunSection from "@/components/dashboard/JustForFunSection";
import YourProgressSection from "@/components/dashboard/YourProgressSection";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <DashboardHeader />
        
        {/* Task 1: Welcome Card */}
        <WelcomeCard />
        
        {/* Task 2: Sage's Picks Section */}
        <SagePicksSection />
        
        {/* Task 3: Just for Fun Section */}
        <JustForFunSection />
        
        {/* Task 4: Your Progress Section */}
        <YourProgressSection />
      </div>
    </DashboardLayout>
  );
}
