import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Task } from "@/lib/mockData";

interface ProjectHealthChartProps {
  tasks: Task[];
}

export function ProjectHealthChart({ tasks }: ProjectHealthChartProps) {
  const activeTasks = tasks.filter(t => t.status !== "Completed");
  
  // Group by project and status
  const projectData = activeTasks.reduce((acc, task) => {
    if (!acc[task.project]) {
      acc[task.project] = { name: task.project, Todo: 0, "In Progress": 0, Review: 0 };
    }
    // @ts-ignore
    if (acc[task.project][task.status] !== undefined) {
       // @ts-ignore
      acc[task.project][task.status]++;
    }
    return acc;
  }, {} as Record<string, any>);

  const data = Object.values(projectData);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium font-display text-muted-foreground uppercase tracking-wider">
          Project Health Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Todo" stackId="a" fill="#64748b" radius={[0, 0, 4, 4]} />
              <Bar dataKey="In Progress" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Review" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}