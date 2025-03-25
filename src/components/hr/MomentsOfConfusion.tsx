
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, UserPlus, Edit, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Confusion data
const confusionData = [
  {
    id: 1,
    role: "Sales",
    module: "Benefits Enrollment",
    details: "Expressed confusion around health insurance options",
    actions: ["Send gentle follow-up", "Assign mentor", "Edit content"]
  },
  {
    id: 2,
    role: "Engineering",
    module: "IT Security",
    details: "Struggled with VPN setup process",
    actions: ["Send gentle follow-up", "Schedule IT session", "Edit content"]
  },
  {
    id: 3,
    role: "Marketing",
    module: "Brand Guidelines",
    details: "Unclear about approval process for social content",
    actions: ["Send gentle follow-up", "Assign mentor", "Schedule review"]
  }
];

const MomentsOfConfusion = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-helvetica text-charcoal flex items-center">
                Moments of Confusion
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-bittersweet/10 text-bittersweet rounded-full">
                  {confusionData.length} items
                </span>
              </CardTitle>
              <p className="text-sm text-charcoal/70 mt-1">
                We'll only show this when it helps you improve someone's experience.
              </p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0 text-charcoal/70">
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              {confusionData.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-charcoal">{item.role} flagged confusion on {item.module}</h4>
                        <p className="text-sm text-charcoal/70 mt-1">{item.details}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-2">
                      {item.actions.map((action, i) => {
                        let Icon;
                        if (action.includes("follow-up")) Icon = MessageCircle;
                        else if (action.includes("mentor") || action.includes("session") || action.includes("review")) Icon = UserPlus;
                        else Icon = Edit;
                        
                        return (
                          <Button 
                            key={i} 
                            variant="outline" 
                            size="sm" 
                            className="border-bittersweet/30 text-bittersweet hover:bg-bittersweet/10"
                          >
                            <Icon className="mr-1 h-3.5 w-3.5" />
                            {action}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default MomentsOfConfusion;
