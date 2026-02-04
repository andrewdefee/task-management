import { Layout } from "@/components/layout/Layout";
import { TaskTable } from "@/components/dashboard/TaskTable";
import { useTasks, useTeamMembers, useProjects, useStatuses, usePriorities } from "@/lib/queries";
import { enrichTasks } from "@/lib/taskUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, AlertCircle, Clock } from "lucide-react";

export default function Delegation() {
  const { data: tasksData, isLoading: tasksLoading } = useTasks();
  const { data: teamMembers, isLoading: teamMembersLoading } = useTeamMembers();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: priorities, isLoading: prioritiesLoading } = usePriorities();

  const isLoading = tasksLoading || teamMembersLoading || projectsLoading || statusesLoading || prioritiesLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading tasks...</div>
        </div>
      </Layout>
    );
  }

  if (!tasksData || !teamMembers || !projects || !statuses || !priorities) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Failed to load data</div>
        </div>
      </Layout>
    );
  }

  const allTasks = enrichTasks(tasksData, teamMembers, projects, statuses, priorities);
  const currentUser = teamMembers[0];
  const delegatedTasks = allTasks.filter(t => t.assigneeId !== currentUser.id && t.status !== "Completed");
  const criticalTasks = delegatedTasks.filter(t => t.priority === "Critical");
  const dueSoon = delegatedTasks.filter(t => {
    const diff = new Date(t.dueDate).getTime() - new Date().getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  });
  
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

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard 
            title="Total Delegated" 
            value={delegatedTasks.length} 
            icon={Users} 
          />
          <StatCard 
            title="Critical Priority" 
            value={criticalTasks.length} 
            icon={AlertCircle} 
            variant="warning"
          />
          <StatCard 
            title="Due Soon" 
            value={dueSoon.length} 
            icon={Clock} 
            variant="info"
          />
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
