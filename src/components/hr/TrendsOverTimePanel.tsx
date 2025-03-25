
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Sample data for the charts
const sentimentData = [
  { day: 'Day 1', Score: 75 },
  { day: 'Day 2', Score: 78 },
  { day: 'Day 3', Score: 80 },
  { day: 'Day 4', Score: 79 },
  { day: 'Day 5', Score: 82 },
  { day: 'Day 6', Score: 85 },
  { day: 'Day 7', Score: 88 },
  { day: 'Day 8', Score: 91 },
  { day: 'Day 9', Score: 89 },
  { day: 'Day 10', Score: 92 },
  { day: 'Day 11', Score: 94 },
  { day: 'Day 12', Score: 95 },
  { day: 'Day 13', Score: 94 },
  { day: 'Day 14', Score: 96 },
];

const milestoneCompletionData = [
  { day: 'Day 1', Completed: 15, Target: 20 },
  { day: 'Day 2', Completed: 28, Target: 32 },
  { day: 'Day 3', Completed: 35, Target: 40 },
  { day: 'Day 4', Completed: 42, Target: 45 },
  { day: 'Day 5', Completed: 51, Target: 52 },
  { day: 'Day 6', Completed: 58, Target: 60 },
  { day: 'Day 7', Completed: 62, Target: 66 },
  { day: 'Day 8', Completed: 69, Target: 72 },
  { day: 'Day 9', Completed: 75, Target: 75 },
  { day: 'Day 10', Completed: 81, Target: 80 },
  { day: 'Day 11', Completed: 85, Target: 84 },
  { day: 'Day 12', Completed: 89, Target: 88 },
  { day: 'Day 13', Completed: 92, Target: 90 },
  { day: 'Day 14', Completed: 95, Target: 92 },
];

const dropOffRecoveryData = [
  { day: 'Day 1', Rate: 30 },
  { day: 'Day 2', Rate: 35 },
  { day: 'Day 3', Rate: 40 },
  { day: 'Day 4', Rate: 50 },
  { day: 'Day 5', Rate: 60 },
  { day: 'Day 6', Rate: 65 },
  { day: 'Day 7', Rate: 70 },
  { day: 'Day 8', Rate: 75 },
  { day: 'Day 9', Rate: 78 },
  { day: 'Day 10', Rate: 80 },
  { day: 'Day 11', Rate: 85 },
  { day: 'Day 12', Rate: 88 },
  { day: 'Day 13', Rate: 90 },
  { day: 'Day 14', Rate: 92 },
];

const TrendsOverTimePanel = () => {
  const [timeRange, setTimeRange] = useState("14");
  const [showOnlyInsights, setShowOnlyInsights] = useState(false);
  
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-helvetica text-charcoal flex items-center">
              Trends Over Time
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-charcoal/70 cursor-help ml-2" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>View how onboarding metrics have changed over time. Toggle between different time periods or focus only on significant changes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="insights-toggle"
                checked={showOnlyInsights}
                onCheckedChange={setShowOnlyInsights}
              />
              <Label htmlFor="insights-toggle" className="text-sm text-charcoal/70">
                Show me insights, not noise
              </Label>
            </div>
            
            <div className="flex items-center rounded-md border border-gray-200">
              <button
                className={`px-3 py-1 text-sm ${timeRange === "14" ? "bg-sagebright-green text-white" : "text-charcoal/70"} rounded-l-md`}
                onClick={() => setTimeRange("14")}
              >
                14d
              </button>
              <button
                className={`px-3 py-1 text-sm ${timeRange === "30" ? "bg-sagebright-green text-white" : "text-charcoal/70"}`}
                onClick={() => setTimeRange("30")}
              >
                30d
              </button>
              <button
                className={`px-3 py-1 text-sm ${timeRange === "90" ? "bg-sagebright-green text-white" : "text-charcoal/70"} rounded-r-md`}
                onClick={() => setTimeRange("90")}
              >
                90d
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="sentiment" className="w-full">
          <TabsList className="w-full mb-6 bg-gray-100">
            <TabsTrigger value="sentiment" className="flex-1">Sentiment Trend</TabsTrigger>
            <TabsTrigger value="milestone" className="flex-1">Milestone Completion</TabsTrigger>
            <TabsTrigger value="dropoff" className="flex-1">Drop-Off Recovery Rate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentiment" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sentimentData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2A9D90" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2A9D90" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#274754" opacity={0.7} />
                  <YAxis stroke="#274754" opacity={0.7} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #eaeaea',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Score" 
                    stroke="#2A9D90" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="milestone" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={milestoneCompletionData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#274754" opacity={0.7} />
                  <YAxis stroke="#274754" opacity={0.7} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #eaeaea', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Completed" 
                    stroke="#2A9D90" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Target" 
                    stroke="#FFCB5C" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={{ r: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="dropoff" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dropOffRecoveryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#88D8B0" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#88D8B0" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#274754" opacity={0.7} />
                  <YAxis stroke="#274754" opacity={0.7} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #eaeaea', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Rate" 
                    stroke="#88D8B0" 
                    fillOpacity={1} 
                    fill="url(#colorRate)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrendsOverTimePanel;
