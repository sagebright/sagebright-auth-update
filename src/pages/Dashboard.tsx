
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CheckCircle, Clock, Users } from "lucide-react";
import TasksList from "@/components/dashboard/TasksList";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import OnboardingProgress from "@/components/dashboard/OnboardingProgress";
import TeamContacts from "@/components/dashboard/TeamContacts";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <DashboardHeader />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">Onboarding Progress</CardTitle>
              <div className="w-8 h-8 bg-sagebright-green/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-sagebright-green" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-green-500 flex items-center">
                +5% from last week
              </p>
              <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-sagebright-green h-2 rounded-full" style={{ width: "68%" }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">Team Members</CardTitle>
              <div className="w-8 h-8 bg-sagebright-gold/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-sagebright-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Across 4 departments</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Tasks</CardTitle>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-red-500">Due within 3 days</p>
            </CardContent>
          </Card>
          
          <Card className="bg-sagebright-green text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Ask Sage</CardTitle>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">Have a question?</div>
              <p className="text-xs text-white/80 mt-1">Get help from your AI mentor</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <TasksList className="lg:col-span-1" />
          <OnboardingProgress className="lg:col-span-1" />
          <UpcomingMeetings className="md:col-span-2 lg:col-span-1" />
        </div>
        
        <div className="grid gap-4 grid-cols-1">
          <TeamContacts />
        </div>
      </div>
    </DashboardLayout>
  );
}
