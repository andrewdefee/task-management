import type { Task as DBTask, TeamMember, Project, Status, Priority } from "@shared/schema";
import type { Task } from "./mockData";

export interface EnrichedTask extends Task {
  projectId: number;
  statusId: number;
  priorityId: number;
  assigneeId: number;
  updatedAt: Date;
}

export function enrichTasks(
  tasks: DBTask[],
  teamMembers: TeamMember[],
  projects: Project[],
  statuses: Status[],
  priorities: Priority[]
): EnrichedTask[] {
  return tasks.map((task) => {
    const teamMember = teamMembers.find((m) => m.id === task.assigneeId);
    const project = projects.find((p) => p.id === task.projectId);
    const status = statuses.find((s) => s.id === task.statusId);
    const priority = priorities.find((p) => p.id === task.priorityId);

    return {
      id: task.id.toString(),
      title: task.title,
      description: task.description || "",
      project: project?.name || "Unknown",
      projectId: task.projectId,
      status: status?.name || "Unknown",
      statusId: task.statusId,
      priority: priority?.name || "Unknown",
      priorityId: task.priorityId,
      assignee: teamMember?.name || "Unknown",
      assigneeId: task.assigneeId,
      dueDate: task.dueDate || new Date(),
      completedAt: task.completedAt || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  });
}
