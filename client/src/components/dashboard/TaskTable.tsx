import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/mockData";
import { format } from "date-fns";
import { AlertCircle, Clock, CheckCircle2, ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface TaskTableProps {
  title: string;
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  className?: string;
  compact?: boolean;
  showMoreHref?: string;
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: Record<string, string> = {
    Critical: "bg-rose-500/15 text-rose-500 border-rose-500/20 hover:bg-rose-500/25",
    High: "bg-amber-500/15 text-amber-500 border-amber-500/20 hover:bg-amber-500/25",
    Medium: "bg-blue-500/15 text-blue-500 border-blue-500/20 hover:bg-blue-500/25",
    Low: "bg-slate-500/15 text-slate-500 border-slate-500/20 hover:bg-slate-500/25",
  };
  
  return (
    <Badge variant="outline" className={styles[priority] || styles.Medium}>
      {priority}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className="flex items-center gap-1.5 text-sm">
      {status === "Completed" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      {status === "In Progress" && <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
      {status === "In Review" && <div className="h-2 w-2 rounded-full bg-purple-500" />}
      {status === "Blocked" && <div className="h-2 w-2 rounded-full bg-orange-500" />}
      {status === "Todo" && <div className="h-2 w-2 rounded-full bg-slate-500" />}
      <span className="text-muted-foreground">{status}</span>
    </span>
  );
};

export function TaskTable({ title, tasks, className, compact = false, showMoreHref }: TaskTableProps) {
  // Always limit to 5 if showMoreHref is present (dashboard view)
  const displayedTasks = showMoreHref ? tasks.slice(0, 5) : tasks;
  const hasMore = showMoreHref && tasks.length > 5;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-display">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="w-[300px]">Task</TableHead>
              <TableHead>Status</TableHead>
              {!compact && <TableHead>Assignee</TableHead>}
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              displayedTasks.map((task) => (
                <TableRow key={task.id} className="group hover:bg-white/5 border-white/5 cursor-pointer transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="group-hover:text-primary transition-colors">{task.title}</span>
                      <span className="text-xs text-muted-foreground">{task.project}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  {!compact && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-secondary-foreground border border-white/10">
                          {task.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-muted-foreground">{task.assignee}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground font-mono">
                    <div className="flex items-center justify-end gap-2">
                      {task.dueDate < new Date() && task.status !== "Completed" && (
                        <AlertCircle className="h-3 w-3 text-rose-500" />
                      )}
                      {format(task.dueDate, "MMM d")}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {hasMore && (
          <div className="p-2 border-t border-white/5">
            <Link href={showMoreHref}>
              <Button 
                variant="ghost" 
                className="w-full text-xs text-muted-foreground hover:text-primary"
              >
                Show More
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}