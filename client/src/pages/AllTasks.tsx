import { Layout } from "@/components/layout/Layout";
import { DelegationTable } from "@/components/dashboard/DelegationTable";
import { MOCK_TASKS } from "@/lib/mockData";
import { StatCard } from "@/components/dashboard/StatCard";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AllTasks() {
  const tasks = MOCK_TASKS.filter(t => t.status !== "Completed");
  const criticalTasks = tasks.filter(t => t.priority === "Critical");
  const dueSoon = tasks.filter(t => {
    const diff = t.dueDate.getTime() - new Date().getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // 3 days
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">All Tasks</h1>
          <p className="text-muted-foreground">Comprehensive list of all outstanding tasks across the organization.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard 
            title="Total Outstanding" 
            value={tasks.length} 
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

        <DelegationTable tasks={tasks} className="w-full" hideHeader={true} />
      </div>
    </Layout>
  );
}