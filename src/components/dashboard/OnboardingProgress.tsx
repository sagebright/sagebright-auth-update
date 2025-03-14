
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  className?: string;
}

export default function OnboardingProgress({ className }: OnboardingProgressProps) {
  const progressCategories = [
    { name: "Company Orientation", progress: 100 },
    { name: "Department Training", progress: 65 },
    { name: "Systems Access", progress: 90 },
    { name: "Role-specific Training", progress: 40 },
    { name: "HR Paperwork", progress: 75 },
  ];

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Onboarding Progress</CardTitle>
          <div className="text-2xl font-bold text-sagebright-green">68%</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium">{category.name}</p>
                <p className="text-muted-foreground">{category.progress}%</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    category.progress === 100
                      ? "bg-green-500"
                      : category.progress >= 50
                      ? "bg-sagebright-green"
                      : "bg-sagebright-gold"
                  )}
                  style={{ width: `${category.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
