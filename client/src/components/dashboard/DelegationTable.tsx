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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskPriority, TaskStatus, TaskAssignee } from "@/lib/mockData";
import { format } from "date-fns";
import { AlertCircle, CheckCircle2, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";

interface DelegationTableProps {
  tasks: Task[];
  className?: string;
}

const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const styles = {
    Critical: "bg-rose-500/15 text-rose-500 border-rose-500/20 hover:bg-rose-500/25",
    High: "bg-amber-500/15 text-amber-500 border-amber-500/20 hover:bg-amber-500/25",
    Medium: "bg-blue-500/15 text-blue-500 border-blue-500/20 hover:bg-blue-500/25",
    Low: "bg-slate-500/15 text-slate-500 border-slate-500/20 hover:bg-slate-500/25",
  };
  
  return (
    <Badge variant="outline" className={styles[priority]}>
      {priority}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: TaskStatus }) => {
  return (
    <span className="flex items-center gap-1.5 text-sm">
      {status === "Completed" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      {status === "In Progress" && <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
      {status === "Review" && <div className="h-2 w-2 rounded-full bg-purple-500" />}
      {status === "Todo" && <div className="h-2 w-2 rounded-full bg-slate-500" />}
      <span className="text-muted-foreground">{status}</span>
    </span>
  );
};

type SortField = "status" | "assignee" | "priority" | "dueDate";
type SortDirection = "asc" | "desc";

export function DelegationTable({ tasks, className }: DelegationTableProps) {
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee))).filter(a => a !== "Me");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter
    if (statusFilter !== "all") {
      result = result.filter(t => t.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      result = result.filter(t => t.priority === priorityFilter);
    }
    if (assigneeFilter !== "all") {
      result = result.filter(t => t.assignee === assigneeFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      // Custom priority sorting value
      if (sortField === "priority") {
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        valA = priorityOrder[a.priority];
        valB = priorityOrder[b.priority];
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, assigneeFilter, sortField, sortDirection]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-medium font-display">Team Delegation & Accountability</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team</SelectItem>
                {uniqueAssignees.map(assignee => (
                  <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="w-[300px]">Task</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("status")} className="h-8 px-2 text-xs font-semibold">
                  Status
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("assignee")} className="h-8 px-2 text-xs font-semibold">
                  Assignee
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("priority")} className="h-8 px-2 text-xs font-semibold">
                  Priority
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort("dueDate")} className="h-8 px-2 text-xs font-semibold ml-auto">
                  Due Date
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No tasks match current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTasks.map((task) => (
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-secondary-foreground border border-white/10">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-muted-foreground">{task.assignee}</span>
                    </div>
                  </TableCell>
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
      </CardContent>
    </Card>
  );
}