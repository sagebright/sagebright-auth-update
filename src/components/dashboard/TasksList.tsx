
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TasksListProps {
  className?: string;
}

export default function TasksList({ className }: TasksListProps) {
  const tasks = [
    { id: 1, title: "Complete company history training", completed: true, dueDate: "Completed" },
    { id: 2, title: "Set up workstation and software", completed: true, dueDate: "Completed" },
    { id: 3, title: "Meet with HR for document review", completed: false, dueDate: "Today" },
    { id: 4, title: "Complete security training", completed: false, dueDate: "Tomorrow" },
    { id: 5, title: "Review department policies", completed: false, dueDate: "May 28" },
  ];

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Pending Tasks</CardTitle>
          <Button variant="link" className="text-sagebright-green p-0 h-auto">View all</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start">
              <div className="mr-2 mt-0.5">
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-sagebright-green" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className={cn("text-sm font-medium leading-none", 
                  task.completed && "line-through text-muted-foreground")}>
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground">{task.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// We need to add the Button component for the "View all" link
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
