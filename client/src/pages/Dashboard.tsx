import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskTable } from "@/components/dashboard/TaskTable";
import { DelegationTable } from "@/components/dashboard/DelegationTable";
import { AgingReport } from "@/components/dashboard/AgingReport";
import { CompletionReport } from "@/components/dashboard/CompletionReport";
import { useTasks, useTeamMembers, useProjects, useStatuses, usePriorities } from "@/lib/queries";
import { enrichTasks } from "@/lib/taskUtils";
import { AlertCircle, CheckCircle2, Clock, Users } from "lucide-react";

export default function Dashboard() {
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
          <div className="text-muted-foreground">Loading dashboard...</div>
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

  const tasks = enrichTasks(tasksData, teamMembers, projects, statuses, priorities);
  
  // For demo purposes, we'll assume the first team member is "Me"
  const currentUser = teamMembers[0];
  
  // Derived State
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== "Completed");
  const delegatedTasks = tasks.filter(t => t.assigneeId !== currentUser.id && t.status !== "Completed");
  const criticalTasks = tasks.filter(t => t.priority === "Critical" && t.status !== "Completed");
  const completedTasks = tasks.filter(t => t.status === "Completed");

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">Executive Cockpit</h1>
            <p className="text-muted-foreground">Good morning, Sir. Here is your operational overview.</p>
          </div>
          <div className="text-right">
             <span className="text-xs font-mono text-muted-foreground block">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="My Open Tasks" 
            value={myTasks.length} 
            icon={CheckCircle2} 
            description={`${myTasks.filter(t => t.dueDate && new Date(t.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000)).length} due soon`}
          />
          <StatCard 
            title="Critical Items" 
            value={criticalTasks.length} 
            icon={AlertCircle} 
            variant="warning"
            description="Requires immediate attention"
          />
          <StatCard 
            title="Delegated" 
            value={delegatedTasks.length} 
            icon={Users} 
            variant="info"
            description={`Active across ${new Set(delegatedTasks.map(t => t.assigneeId)).size} team members`}
          />
          <StatCard 
            title="Completed (Q1)" 
            value={completedTasks.length} 
            icon={Clock} 
            variant="success"
            description="Ahead of schedule"
          />
        </div>

        {/* Reports Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <CompletionReport tasks={tasks} />
          </div>
          <div className="lg:col-span-3">
            <AgingReport tasks={tasks} />
          </div>
        </div>

        {/* Content Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <TaskTable 
            title="Priority Attention" 
            tasks={criticalTasks} 
            className="h-full" 
            showMoreHref="/all-tasks"
          />
          <TaskTable 
            title="Assigned to Me" 
            tasks={myTasks} 
            className="h-full" 
            showMoreHref="/my-tasks"
          />
        </div>

         {/* Delegation Row */}
         <div>
          <DelegationTable 
            tasks={delegatedTasks} 
            className="w-full" 
            limit={15}
            showMoreHref="/delegation"
          />
         </div>
      </div>
    </Layout>
  );
}
