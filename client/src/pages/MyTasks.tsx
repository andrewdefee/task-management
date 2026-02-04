import { Layout } from "@/components/layout/Layout";
import { DelegationTable } from "@/components/dashboard/DelegationTable";
import { useTasks, useTeamMembers, useProjects, useStatuses, usePriorities } from "@/lib/queries";
import { enrichTasks } from "@/lib/taskUtils";
import { StatCard } from "@/components/dashboard/StatCard";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function MyTasks() {
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
  const myTasks = allTasks.filter(t => t.assigneeId === currentUser.id && t.status !== "Completed");
  const criticalTasks = myTasks.filter(t => t.priority === "Critical");
  const dueSoon = myTasks.filter(t => {
    const diff = new Date(t.dueDate).getTime() - new Date().getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">My Tasks</h1>
          <p className="text-muted-foreground">Personal execution queue and assignments.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard 
            title="Total Assigned" 
            value={myTasks.length} 
            icon={CheckCircle2} 
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

        <DelegationTable 
          tasks={myTasks} 
          className="w-full" 
          hideHeader={true} 
          hideAssigneeFilter={true} 
          showDueSoonFilter={true}
        />
      </div>
    </Layout>
  );
}
