
import React from 'react';
import { DashboardContainer } from '@/components/layout/DashboardContainer';

// Import custom components for each dashboard section
import SageGreetingHeader from '@/components/hr/SageGreetingHeader';
import MetricCardsGrid from '@/components/hr/MetricCardsGrid';
import ClarityIndexPanel from '@/components/hr/ClarityIndexPanel';
import MomentsOfConfusion from '@/components/hr/MomentsOfConfusion';
import TrendsOverTimePanel from '@/components/hr/TrendsOverTimePanel';
import SageFooter from '@/components/hr/SageFooter';

const HRDashboard = () => {
  return (
    <DashboardContainer>
      <div className="space-y-8">
        {/* Sage Greeting Header */}
        <SageGreetingHeader />
        
        {/* Metrics Cards */}
        <MetricCardsGrid />
        
        {/* Clarity Index */}
        <ClarityIndexPanel />
        
        {/* Moments of Confusion */}
        <MomentsOfConfusion />
        
        {/* Trends Over Time */}
        <TrendsOverTimePanel />
        
        {/* Sage Footer */}
        <SageFooter />
      </div>
    </DashboardContainer>
  );
};

export default HRDashboard;
