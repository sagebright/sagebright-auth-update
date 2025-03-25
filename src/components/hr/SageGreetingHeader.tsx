
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Send } from 'lucide-react';

const SageGreetingHeader = () => {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 flex-shrink-0 rounded-full overflow-hidden">
          <img
            src="/lovable-uploads/sage_avatar.png"
            alt="Sage Assistant"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-1 flex-grow">
          <h2 className="text-2xl font-helvetica font-semibold text-charcoal">
            HR Dashboard
          </h2>
          <p className="text-charcoal/70 font-roboto max-w-2xl">
            Here's how onboarding is landing across your team. You'll see clarity, hesitation, and milestones at a glance. Privacy is protected — always.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <Button variant="outline" className="flex items-center gap-2 text-charcoal border-gray-200 hover:bg-sagebright-accent/10 hover:text-sagebright-green hover:border-sagebright-accent/30">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </Button>
        <Button className="flex items-center gap-2 bg-sagebright-green hover:bg-sagebright-green/90">
          <Send className="h-4 w-4" />
          <span>Send Feedback</span>
        </Button>
      </div>
    </div>
  );
};

export default SageGreetingHeader;
