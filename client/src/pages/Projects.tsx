import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProjectHealthChart } from "@/components/reports/ProjectHealthChart";
import { TaskTable } from "@/components/dashboard/TaskTable";
import { MOCK_TASKS } from "@/lib/mockData";
import { CheckCircle2, AlertCircle, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Projects() {
  const tasks = MOCK_TASKS;
  const activeTasks = tasks.filter(t => t.status !== "Completed");
  const criticalTasks = activeTasks.filter(t => t.priority === "Critical");
  const dueSoon = activeTasks.filter(t => {
    const diff = t.dueDate.getTime() - new Date().getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // 3 days
  });
  
  // Get unique projects
  const uniqueProjects = Array.from(new Set(tasks.map(t => t.project)));

  // Group tasks by project
  const projectTasks: Record<string, typeof tasks> = {};
  uniqueProjects.forEach(p => {
    projectTasks[p] = tasks.filter(t => t.project === p && t.status !== "Completed");
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
            value={uniqueProjects.length} 
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
            {uniqueProjects.map((project) => (
              <div key={project} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                       <BriefcaseIcon className="h-4 w-4" />
                     </div>
                     <div>
                      <h3 className="font-medium text-lg leading-none">{project}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{projectTasks[project]?.length || 0} active tasks</p>
                     </div>
                  </div>
                  <Badge variant="outline">On Track</Badge>
                </div>
                <TaskTable title={`${project} Tasks`} tasks={projectTasks[project] || []} compact />
              </div>
            ))}
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