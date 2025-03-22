
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
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-gray-50/50">
        {/* Header with welcome message */}
        <DashboardHeader />
        
        {/* Sage's Welcome Card - Central positioning */}
        <WelcomeCard />
        
        {/* Content Sections with consistent spacing */}
        <div className="space-y-10">
          {/* Sage's Picks Section */}
          <SagePicksSection />
          
          {/* Just for Fun Section */}
          <JustForFunSection />
          
          {/* Your Progress Section */}
          <YourProgressSection />
        </div>
      </div>
    </DashboardLayout>
  );
}
