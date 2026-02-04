import { Layout } from "@/components/layout/Layout";
import { DelegationTable } from "@/components/dashboard/DelegationTable";
import { MOCK_TASKS } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AllTasks() {
  const tasks = MOCK_TASKS.filter(t => t.status !== "Completed");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">All Tasks</h1>
          <p className="text-muted-foreground">Comprehensive list of all outstanding tasks across the organization.</p>
        </div>

        <DelegationTable tasks={tasks} className="w-full" hideHeader={true} />
      </div>
    </Layout>
  );
}