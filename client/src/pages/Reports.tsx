import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { CompletionReport } from "@/components/dashboard/CompletionReport";
import { WorkloadChart } from "@/components/reports/WorkloadChart";
import { ProjectHealthChart } from "@/components/reports/ProjectHealthChart";
import { PriorityDistributionChart } from "@/components/reports/PriorityDistributionChart";
import { MOCK_TASKS } from "@/lib/mockData";
import { Activity, Target, Zap, Clock } from "lucide-react";
import { differenceInDays } from "date-fns";

export default function Reports() {
  const tasks = MOCK_TASKS;
  const completedTasks = tasks.filter(t => t.status === "Completed");
  
  // Calculate average completion time (mock calculation)
  const avgDays = completedTasks.length > 0 
    ? Math.round(completedTasks.reduce((acc, t) => {
        if (t.completedAt && t.createdAt) {
          return acc + differenceInDays(t.completedAt, t.createdAt);
        }
        return acc;
      }, 0) / completedTasks.length)
    : 0;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">Executive Reports</h1>
          <p className="text-muted-foreground">Strategic analysis and operational metrics.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard 
            title="Total Throughput" 
            value={completedTasks.length} 
            icon={Zap} 
            variant="success"
            description="Tasks completed all-time"
          />
          <StatCard 
            title="Avg. Cycle Time" 
            value={`${avgDays} Days`} 
            icon={Clock} 
            description="Creation to completion"
          />
          <StatCard 
            title="Active Projects" 
            value="5" 
            icon={Target} 
            variant="info"
            description="Currently in flight"
          />
          <StatCard 
            title="Resource Load" 
            value="82%" 
            icon={Activity} 
            variant="warning"
            description="Team utilization rate"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <CompletionReport tasks={tasks} />
          <WorkloadChart tasks={tasks} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2">
            <ProjectHealthChart tasks={tasks} />
          </div>
          <div className="col-span-1">
            <PriorityDistributionChart tasks={tasks} />
          </div>
        </div>

      </div>
    </Layout>
  );
}