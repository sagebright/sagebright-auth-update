
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Video, Users, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpcomingMeetingsProps {
  className?: string;
}

export default function UpcomingMeetings({ className }: UpcomingMeetingsProps) {
  const meetings = [
    {
      id: 1,
      title: "Team Introduction",
      time: "10:00 AM - 11:00 AM",
      type: "video",
      icon: Video,
    },
    {
      id: 2,
      title: "Mentor Check-in",
      time: "2:00 PM - 2:30 PM",
      type: "person",
      icon: Coffee,
    },
    {
      id: 3,
      title: "Department Overview",
      time: "3:30 PM - 4:30 PM",
      type: "video",
      icon: Users,
    },
  ];

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Today's Schedule</CardTitle>
          <div className="flex items-center text-sm font-medium text-sagebright-green">
            <Calendar className="mr-1 h-4 w-4" />
            May 27
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const Icon = meeting.icon;
            return (
              <div key={meeting.id} className="flex items-start space-x-3">
                <div className="mt-0.5 bg-sagebright-green/10 p-2 rounded-full">
                  <Icon className="h-4 w-4 text-sagebright-green" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm leading-none">
                    {meeting.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {meeting.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
