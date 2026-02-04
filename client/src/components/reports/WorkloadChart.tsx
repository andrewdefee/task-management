import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Task } from "@/lib/mockData";

interface WorkloadChartProps {
  tasks: Task[];
}

export function WorkloadChart({ tasks }: WorkloadChartProps) {
  const activeTasks = tasks.filter(t => t.status !== "Completed");
  
  const workload = activeTasks.reduce((acc, task) => {
    acc[task.assignee] = (acc[task.assignee] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(workload)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium font-display text-muted-foreground uppercase tracking-wider">
          Team Workload Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                width={100}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.name === "Me" ? "#10b981" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}