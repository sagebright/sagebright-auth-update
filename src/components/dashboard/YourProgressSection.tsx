
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Users, Building } from "lucide-react";
import { cn } from "@/lib/utils";

export default function YourProgressSection() {
  const progressItems = [
    {
      id: 1,
      title: "HR Paperwork",
      completed: 3,
      total: 5,
      percentage: 60,
      icon: FileText,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-500"
    },
    {
      id: 2,
      title: "Meet the Team",
      completed: 1,
      total: 4,
      percentage: 25,
      icon: Users,
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-500"
    },
    {
      id: 3,
      title: "Learn About the Company",
      completed: 4,
      total: 5,
      percentage: 80,
      icon: Building,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {progressItems.map((item) => (
          <Card 
            key={item.id} 
            className="md:col-span-3 lg:col-span-2 bg-white"
          >
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className={`${item.bgColor} p-3 rounded-full`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
              </div>
              <span className="text-2xl font-bold">{item.percentage}%</span>
            </CardHeader>
            
            <CardContent className="px-6 pb-6 pt-0">
              <div className="space-y-2">
                <CustomProgress 
                  value={item.percentage} 
                  className="h-2" 
                  indicatorClassName={getProgressColor(item.percentage)}
                />
                <p className="text-sm text-gray-500 text-right">
                  {item.completed} of {item.total} tasks completed
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function to get progress bar color based on percentage
function getProgressColor(percentage: number): string {
  if (percentage >= 80) return "bg-emerald-500";
  if (percentage >= 50) return "bg-sagebright-green";
  if (percentage >= 25) return "bg-amber-500";
  return "bg-red-500";
}

// Extend Progress component to accept indicatorClassName
const CustomProgress = React.forwardRef<
  React.ElementRef<typeof Progress>,
  React.ComponentPropsWithoutRef<typeof Progress> & {
    indicatorClassName?: string;
  }
>(({ className, indicatorClassName, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-100",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
});
CustomProgress.displayName = "CustomProgressIndicator";
