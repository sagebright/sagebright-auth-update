
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Video, ClipboardCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function SagePicksSection() {
  const sagePickItems = [
    {
      id: 1,
      title: "Watch Welcome Video",
      timeEstimate: 5,
      icon: Video,
      bgColor: "bg-bittersweet/10",
      iconColor: "text-bittersweet"
    },
    {
      id: 2,
      title: "Complete Payroll Form",
      timeEstimate: 10,
      icon: ClipboardCheck,
      bgColor: "bg-sagebright-green/10",
      iconColor: "text-sagebright-green"
    },
    {
      id: 4,
      title: "Meet Your Manager",
      timeEstimate: 15,
      icon: Users,
      bgColor: "bg-sunglow/10",
      iconColor: "text-sunglow"
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-helvetica font-bold text-charcoal">Sage's Picks for Today</h2>
        <Button variant="link" className="text-sagebright-green">View all</Button>
      </div>
      
      <Separator className="bg-sagebright-accent/20" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sagePickItems.map((item) => (
          <Card key={item.id} className="bg-white hover:shadow-card-hover transition-shadow rounded-2xl border border-gray-100 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className={`${item.bgColor} p-3 rounded-full mr-4`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-helvetica font-medium text-charcoal">{item.title}</h3>
                  <p className="text-sm font-roboto text-charcoal/60 mt-1">{item.timeEstimate} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
