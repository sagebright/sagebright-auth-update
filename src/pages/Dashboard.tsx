
import React from "react";
import { DashboardContainer } from "@/components/layout/DashboardContainer";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import SagePicksSection from "@/components/dashboard/SagePicksSection";
import JustForFunSection from "@/components/dashboard/JustForFunSection";
import YourProgressSection from "@/components/dashboard/YourProgressSection";

export default function Dashboard() {
  // No need to make any direct API calls or Supabase queries here
  // The auth context and context hook handle everything
  
  return (
    <DashboardContainer>
      <div className="space-y-8">
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
    </DashboardContainer>
  );
}
