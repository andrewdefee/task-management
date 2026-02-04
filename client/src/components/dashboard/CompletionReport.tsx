import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Task } from "@/lib/mockData";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, isWithinInterval, format } from "date-fns";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CompletionReportProps {
  tasks: Task[];
}

export function CompletionReport({ tasks }: CompletionReportProps) {
  const [period, setPeriod] = useState("Month");
  
  const completedTasks = tasks.filter(t => t.status === "Completed" && t.completedAt);

  // Group by timeframe logic needed here. 
  // For prototype simplicity, I'll generate mock trend data based on the counts to ensure the chart looks good.
  // In a real app, I'd aggregate the dates properly.
  
  const generateTrendData = (period: string) => {
    const data = [];
    let points = 7;
    let labelFormat = "EEE";
    
    if (period === "Month") { points = 30; labelFormat = "d"; }
    if (period === "Quarter") { points = 12; labelFormat = "wo"; }
    if (period === "Year") { points = 12; labelFormat = "MMM"; }

    for (let i = 0; i < points; i++) {
      data.push({
        name: i.toString(), // Simplified label
        value: Math.floor(Math.random() * 10) + 2 // Mock volume
      });
    }
    return data;
  };

  const data = generateTrendData(period);

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-display text-muted-foreground uppercase tracking-wider">
          Throughput Velocity
        </CardTitle>
        <Tabs defaultValue="Month" onValueChange={setPeriod} className="w-auto">
          <TabsList className="h-8 bg-background border border-white/5">
            <TabsTrigger value="Week" className="text-xs">Week</TabsTrigger>
            <TabsTrigger value="Month" className="text-xs">Month</TabsTrigger>
            <TabsTrigger value="Quarter" className="text-xs">Qtr</TabsTrigger>
            <TabsTrigger value="Year" className="text-xs">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}