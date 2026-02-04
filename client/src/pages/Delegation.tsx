import { Layout } from "@/components/layout/Layout";
import { TaskTable } from "@/components/dashboard/TaskTable";
import { MOCK_TASKS, TaskAssignee } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Delegation() {
  const delegatedTasks = MOCK_TASKS.filter(t => t.assignee !== "Me" && t.status !== "Completed");
  
  // Group by assignee
  const groupedTasks: Record<string, typeof delegatedTasks> = {};
  delegatedTasks.forEach(task => {
    if (!groupedTasks[task.assignee]) {
      groupedTasks[task.assignee] = [];
    }
    groupedTasks[task.assignee].push(task);
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">Team Delegation</h1>
          <p className="text-muted-foreground">Oversight of tasks assigned to team members.</p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedTasks).map(([assignee, tasks]) => (
            <div key={assignee} className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">
                    {assignee.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-display font-semibold text-white">{assignee}</h2>
                <span className="text-sm text-muted-foreground">({tasks.length} tasks)</span>
              </div>
              <TaskTable title={`${assignee}'s Tasks`} tasks={tasks} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}