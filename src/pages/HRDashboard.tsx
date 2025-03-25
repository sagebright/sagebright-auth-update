
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, Send, ChevronDown, ChevronUp, UserPlus, Edit, ExternalLink } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Import custom components for each dashboard section
import SageGreetingHeader from '@/components/hr/SageGreetingHeader';
import MetricCardsGrid from '@/components/hr/MetricCardsGrid';
import ClarityIndexPanel from '@/components/hr/ClarityIndexPanel';
import MomentsOfConfusion from '@/components/hr/MomentsOfConfusion';
import TrendsOverTimePanel from '@/components/hr/TrendsOverTimePanel';
import SageFooter from '@/components/hr/SageFooter';

const HRDashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-gray-50/50">
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
    </DashboardLayout>
  );
};

export default HRDashboard;
