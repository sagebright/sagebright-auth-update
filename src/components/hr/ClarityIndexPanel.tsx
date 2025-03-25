
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Clarity module data
const clarityModules = [
  { 
    id: 1, 
    name: "Company Overview", 
    score: 94, 
    sentiment: "high",
    tip: null,
    quote: "The company values were clearly explained and helped me understand our mission."
  },
  { 
    id: 2, 
    name: "Benefits Enrollment", 
    score: 72, 
    sentiment: "medium",
    tip: "3 employees hesitated here — consider rewording this step.",
    quote: "I wasn't sure which option was best for my situation."
  },
  { 
    id: 3, 
    name: "Team Introduction", 
    score: 98, 
    sentiment: "high",
    tip: null,
    quote: "Meeting everyone was seamless and I felt welcomed immediately."
  },
  { 
    id: 4, 
    name: "IT Setup", 
    score: 85, 
    sentiment: "high",
    tip: null,
    quote: "The software installation was straightforward but I needed help with VPN."
  },
  { 
    id: 5, 
    name: "HR Policies", 
    score: 68, 
    sentiment: "medium",
    tip: "5 employees found this section lengthy — consider breaking into smaller modules.",
    quote: "There was a lot to digest at once. Maybe splitting this into smaller sections would help."
  },
  { 
    id: 6, 
    name: "Security Training", 
    score: 91, 
    sentiment: "high",
    tip: null,
    quote: "The interactive examples made security protocols easy to understand."
  },
];

// Function to determine gradient color based on sentiment score
const getSentimentGradient = (score: number) => {
  if (score >= 90) return "bg-gradient-to-r from-sagebright-green to-sagebright-accent";
  if (score >= 80) return "bg-gradient-to-r from-sagebright-accent to-sagebright-accent/80";
  if (score >= 70) return "bg-gradient-to-r from-sagebright-accent/80 to-sunglow";
  if (score >= 60) return "bg-gradient-to-r from-sunglow to-sunglow/80";
  return "bg-gradient-to-r from-sunglow/80 to-bittersweet";
};

const ClarityIndexPanel = () => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-helvetica text-charcoal">Clarity Index</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-charcoal/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>The Clarity Index shows which onboarding steps are clear vs confusing to new employees. Higher scores indicate better clarity.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clarityModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Module card component
const ModuleCard = ({ module }: { module: any }) => {
  const [showQuote, setShowQuote] = useState(false);
  
  return (
    <div 
      className="p-4 border border-gray-100 rounded-lg bg-white hover:shadow-sm transition-all duration-200 relative"
      onMouseEnter={() => setShowQuote(true)}
      onMouseLeave={() => setShowQuote(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-charcoal">{module.name}</h3>
        <span className={`text-lg font-bold ${module.score >= 80 ? 'text-sagebright-green' : module.score >= 70 ? 'text-sunglow' : 'text-bittersweet'}`}>
          {module.score}%
        </span>
      </div>
      
      {/* Sentiment bar */}
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getSentimentGradient(module.score)}`} 
          style={{ width: `${module.score}%` }}
        ></div>
      </div>
      
      {/* Tip if available */}
      {module.tip && (
        <div className="mt-2 text-sm text-charcoal/80 flex items-start gap-1.5">
          <HelpCircle className="h-4 w-4 text-sunglow flex-shrink-0 mt-0.5" />
          <span>{module.tip}</span>
        </div>
      )}
      
      {/* Anonymous quote on hover */}
      {showQuote && (
        <div className="absolute inset-0 bg-white/95 rounded-lg p-4 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="text-center">
            <p className="text-sm italic text-charcoal/80 font-light">"{module.quote}"</p>
            <p className="text-xs text-charcoal/60 mt-2">— Anonymous employee</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClarityIndexPanel;
