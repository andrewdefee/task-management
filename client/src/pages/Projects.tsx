import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProjectHealthChart } from "@/components/reports/ProjectHealthChart";
import { TaskTable } from "@/components/dashboard/TaskTable";
import { useTasks, useTeamMembers, useProjects, useStatuses, usePriorities } from "@/lib/queries";
import { enrichTasks } from "@/lib/taskUtils";
import { CheckCircle2, AlertCircle, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function getProjectHealth(tasks: ReturnType<typeof enrichTasks>) {
  if (tasks.length === 0) return { status: "On Track", variant: "outline" as const };
  
  const now = new Date();
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  const activeTasks = tasks.filter(t => t.status !== "Completed");
  
  const isHighPriority = (priority: string) => priority === "High" || priority === "Critical";
  
  const highPriorityAtRisk = activeTasks.filter(t => {
    if (!isHighPriority(t.priority)) return false;
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const diff = dueDate.getTime() - now.getTime();
    return diff < threeDaysMs;
  });
  
  const regularTasksNeedAttention = activeTasks.filter(t => {
    if (isHighPriority(t.priority)) return false;
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const diff = dueDate.getTime() - now.getTime();
    return diff > 0 && diff < threeDaysMs;
  });

  if (highPriorityAtRisk.length > 0) {
    return { status: "At Risk", variant: "destructive" as const };
  }
  
  if (regularTasksNeedAttention.length > 0) {
    return { status: "Needs Attention", variant: "secondary" as const };
  }
  
  return { status: "On Track", variant: "outline" as const };
}

export default function Projects() {
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
          <div className="text-muted-foreground">Loading projects...</div>
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
  const activeTasks = tasks.filter(t => t.status !== "Completed");
  const criticalTasks = activeTasks.filter(t => t.priority === "Critical");
  const dueSoon = activeTasks.filter(t => {
    const diff = new Date(t.dueDate).getTime() - new Date().getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  });

  const projectTasks: Record<string, typeof tasks> = {};
  projects.forEach(p => {
    projectTasks[p.name] = tasks.filter(t => t.project === p.name && t.status !== "Completed");
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">Projects Portfolio</h1>
          <p className="text-muted-foreground">Strategic oversight of all active initiatives.</p>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard 
            title="Total Outstanding" 
            value={activeTasks.length} 
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
          <StatCard 
            title="Active Projects" 
            value={projects.length} 
            icon={Target} 
            variant="success"
            description="Currently in flight"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 grid-cols-1">
          <ProjectHealthChart tasks={tasks} />
        </div>

        {/* Projects Breakdown */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-semibold text-white">Active Initiatives</h2>
          <div className="grid gap-6">
            {projects.map((project) => {
              const projectTaskList = projectTasks[project.name] || [];
              const health = getProjectHealth(projectTaskList);
              
              return (
                <div key={project.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                         <BriefcaseIcon className="h-4 w-4" />
                       </div>
                       <div>
                        <h3 className="font-medium text-lg leading-none">{project.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{projectTaskList.length} active tasks</p>
                       </div>
                    </div>
                    <Badge 
                      variant={health.variant}
                      className={
                        health.status === "At Risk" 
                          ? "bg-rose-500/15 text-rose-500 border-rose-500/20" 
                          : health.status === "Needs Attention"
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/20"
                          : ""
                      }
                    >
                      {health.status}
                    </Badge>
                  </div>
                  {projectTaskList.length > 0 ? (
                    <TaskTable title={`${project.name} Tasks`} tasks={projectTaskList} compact />
                  ) : (
                    <div className="text-sm text-muted-foreground py-4 text-center border border-white/10 rounded-lg">
                      No active tasks for this project
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function BriefcaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}
