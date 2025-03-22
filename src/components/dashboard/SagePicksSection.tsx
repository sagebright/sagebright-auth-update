
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Video, ClipboardCheck, BookOpen, Users } from "lucide-react";

export default function SagePicksSection() {
  const sagePickItems = [
    {
      id: 1,
      title: "Watch Welcome Video",
      timeEstimate: 5,
      icon: Video,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      id: 2,
      title: "Complete Payroll Form",
      timeEstimate: 10,
      icon: ClipboardCheck,
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      id: 3,
      title: "Review Employee Handbook Highlights",
      timeEstimate: 8,
      icon: BookOpen,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500"
    },
    {
      id: 4,
      title: "Meet Your Manager",
      timeEstimate: 15,
      icon: Users,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Sage's Picks for Today</h2>
        <Button variant="link" className="text-sagebright-green">View all</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sagePickItems.map((item) => (
          <Card key={item.id} className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className={`${item.bgColor} p-3 rounded-full mr-4`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.timeEstimate} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Button component for "View all" link
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        variant === "link" && "text-primary underline-offset-4 hover:underline",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Import cn utility
import { cn } from "@/lib/utils";
