import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Task } from "@/lib/mockData";
import { differenceInDays } from "date-fns";

interface AgingReportProps {
  tasks: Task[];
}

export function AgingReport({ tasks }: AgingReportProps) {
  const now = new Date();
  
  // Filter out completed tasks
  const openTasks = tasks.filter(t => t.status !== "Completed");

  // Buckets
  const buckets = {
    "7": 0,
    "14": 0,
    "30": 0,
    "60": 0,
    "90": 0,
    "120": 0,
    "120+": 0,
  };

  openTasks.forEach(task => {
    const age = differenceInDays(now, task.createdAt);
    if (age <= 7) buckets["7"]++;
    else if (age <= 14) buckets["14"]++;
    else if (age <= 30) buckets["30"]++;
    else if (age <= 60) buckets["60"]++;
    else if (age <= 90) buckets["90"]++;
    else if (age <= 120) buckets["120"]++;
    else buckets["120+"]++;
  });

  const data = Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded shadow-lg text-sm">
          <p className="font-semibold mb-1 text-foreground">{label} Days</p>
          <p className="text-muted-foreground">
            Tasks: <span className="text-primary font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 min-h-[300px]">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium font-display text-muted-foreground uppercase tracking-wider">
            Task Aging Analysis
          </CardTitle>
          <p className="text-xs text-muted-foreground">Days Outstanding</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="range" 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index > 4 ? '#f43f5e' : index > 2 ? '#f59e0b' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}