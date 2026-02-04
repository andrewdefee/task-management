import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Task } from "@/lib/mockData";

interface PriorityDistributionChartProps {
  tasks: Task[];
}

export function PriorityDistributionChart({ tasks }: PriorityDistributionChartProps) {
  const activeTasks = tasks.filter(t => t.status !== "Completed");
  
  const priorities = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0
  };

  activeTasks.forEach(t => {
    priorities[t.priority]++;
  });

  const data = Object.entries(priorities).map(([name, value]) => ({ name, value }));
  
  const COLORS = {
    Critical: '#ef4444', // rose-500
    High: '#f59e0b',     // amber-500
    Medium: '#3b82f6',   // blue-500
    Low: '#64748b'       // slate-500
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium font-display text-muted-foreground uppercase tracking-wider">
          Strategic Focus (Priority)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  // @ts-ignore
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} stroke="rgba(0,0,0,0)" />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                 itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend 
                verticalAlign="middle" 
                align="right"
                layout="vertical"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}