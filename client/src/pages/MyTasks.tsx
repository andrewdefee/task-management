import { Layout } from "@/components/layout/Layout";
import { DelegationTable } from "@/components/dashboard/DelegationTable";
import { MOCK_TASKS } from "@/lib/mockData";
import { StatCard } from "@/components/dashboard/StatCard";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function MyTasks() {
  const myTasks = MOCK_TASKS.filter(t => t.assignee === "Me" && t.status !== "Completed");
  const criticalTasks = myTasks.filter(t => t.priority === "Critical");
  const dueSoon = myTasks.filter(t => {
    const diff = t.dueDate.getTime() - new Date().getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // 3 days
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

        <DelegationTable tasks={myTasks} className="w-full" />
      </div>
    </Layout>
  );
}