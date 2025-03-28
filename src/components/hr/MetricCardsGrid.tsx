
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, UserCheck, Book, ExternalLink } from 'lucide-react';

const MetricCardsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Onboarding Completion Rate */}
      <Card className="bg-white overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
        <div className="h-1 bg-sagebright-green w-full"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-helvetica text-charcoal">Onboarding Completion Rate</CardTitle>
            <CheckCircle className="h-5 w-5 text-sagebright-green flex-shrink-0 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <div className="flex flex-col h-full">
            <span className="text-4xl font-bold text-charcoal">93%</span>
            <span className="text-sm text-charcoal/70 mt-1">Completed core onboarding</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 mt-auto">
          <a href="#" className="text-sm text-sagebright-green flex items-center hover:underline">
            View details
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </CardFooter>
      </Card>

      {/* Card 2: Milestone Reach Rate */}
      <Card className="bg-white overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
        <div className="h-1 bg-sunglow w-full"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-helvetica text-charcoal">Milestone Reach Rate</CardTitle>
            <Clock className="h-5 w-5 text-sunglow flex-shrink-0 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <div className="flex flex-col h-full">
            <span className="text-4xl font-bold text-charcoal">88%</span>
            <span className="text-sm text-charcoal/70 mt-1">% of new hires hitting key onboarding milestones</span>
          </div>
          {/* Mini bar chart placeholder */}
          <div className="h-10 w-full mt-2 flex items-end space-x-1">
            <div className="h-3 w-1/8 bg-sagebright-accent/40 rounded-sm"></div>
            <div className="h-5 w-1/8 bg-sagebright-accent/60 rounded-sm"></div>
            <div className="h-7 w-1/8 bg-sagebright-accent/80 rounded-sm"></div>
            <div className="h-8 w-1/8 bg-sagebright-green rounded-sm"></div>
            <div className="h-10 w-1/8 bg-sagebright-green rounded-sm"></div>
            <div className="h-6 w-1/8 bg-sagebright-accent/70 rounded-sm"></div>
            <div className="h-4 w-1/8 bg-sagebright-accent/50 rounded-sm"></div>
            <div className="h-2 w-1/8 bg-sagebright-accent/30 rounded-sm"></div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Time to Productivity */}
      <Card className="bg-white overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
        <div className="h-1 bg-sagebright-green w-full"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-helvetica text-charcoal">Time to Productivity</CardTitle>
            <UserCheck className="h-5 w-5 text-sagebright-green flex-shrink-0 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <div className="flex flex-col h-full">
            <span className="text-4xl font-bold text-charcoal">34</span>
            <span className="text-sm text-charcoal/70 mt-1">Average days to baseline performance metrics</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 mt-auto">
          <a href="#" className="text-sm text-sagebright-green flex items-center hover:underline">
            Manage participants
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </CardFooter>
      </Card>

      {/* Card 4: New Hire Retention */}
      <Card className="bg-white overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
        <div className="h-1 bg-sagebright-green w-full"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-helvetica text-charcoal">New Hire Retention</CardTitle>
            <Book className="h-5 w-5 text-sagebright-green flex-shrink-0 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <div className="flex flex-col h-full">
            <span className="text-4xl font-bold text-charcoal">95%</span>
            <span className="text-sm text-charcoal/70 mt-1">% of new hires employed 90 days after start</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 mt-auto">
          <a href="#" className="text-sm text-sagebright-green flex items-center hover:underline">
            View content analytics
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MetricCardsGrid;
