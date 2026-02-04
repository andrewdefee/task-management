import { addDays, subDays } from "date-fns";

export type TaskStatus = "Todo" | "In Progress" | "In Review" | "Blocked" | "Completed";
export type TaskPriority = "Critical" | "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  project: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  description: string;
}

type TaskAssignee = "Me" | "John Doe" | "Sarah Smith" | "Mike Ross" | "Rachel Green";

const generateTasks = (): Task[] => {
  const tasks: Task[] = [];
  const projects = ["Q3 Financials", "Project Phoenix", "Client Acquisition", "Legal Review", "Board Prep"];
  const assignees: TaskAssignee[] = ["Me", "John Doe", "Sarah Smith", "Mike Ross", "Rachel Green"];
  
  // Outstanding tasks (Aging)
  // Create some old tasks for the aging report
  const now = new Date();
  
  // 120+ days old
  tasks.push({
    id: "t-1",
    title: "Legacy System Audit",
    project: "Project Phoenix",
    status: "In Progress",
    priority: "Low",
    assignee: "Mike Ross",
    dueDate: subDays(now, 100),
    createdAt: subDays(now, 130),
    description: "Full audit of the legacy COBOL systems."
  });

  // 90 days
  tasks.push({
    id: "t-2",
    title: "Quarterly Compliance Check",
    project: "Legal Review",
    status: "Todo",
    priority: "Medium",
    assignee: "Sarah Smith",
    dueDate: subDays(now, 80),
    createdAt: subDays(now, 95),
    description: "Standard compliance run."
  });

  // 60 days
  tasks.push({
    id: "t-3",
    title: "Vendor Contract Renegotiation",
    project: "Q3 Financials",
    status: "Review",
    priority: "High",
    assignee: "Me",
    dueDate: subDays(now, 50),
    createdAt: subDays(now, 65),
    description: "Negotiate better rates with AWS."
  });

  // 30 days
  tasks.push({
    id: "t-4",
    title: "Team Performance Reviews",
    project: "Board Prep",
    status: "Todo",
    priority: "High",
    assignee: "Me",
    dueDate: subDays(now, 20),
    createdAt: subDays(now, 35),
    description: "Year-end reviews for direct reports."
  });

  // Recent / Current
  for(let i = 0; i < 20; i++) {
    tasks.push({
      id: `t-current-${i}`,
      title: `Task ${i} - ${projects[i % projects.length]}`,
      project: projects[i % projects.length],
      status: i % 3 === 0 ? "Todo" : i % 3 === 1 ? "In Progress" : "Review",
      priority: i % 4 === 0 ? "Critical" : "Medium",
      assignee: assignees[i % assignees.length],
      dueDate: addDays(now, i * 2),
      createdAt: subDays(now, i),
      description: "Standard task description."
    });
  }

  // Completed Tasks (for Reporting)
  for(let i = 0; i < 50; i++) {
    const completeDate = subDays(now, i * 3); // Spread out over ~5 months
    tasks.push({
      id: `t-comp-${i}`,
      title: `Completed Task ${i}`,
      project: projects[i % projects.length],
      status: "Completed",
      priority: "Medium",
      assignee: assignees[i % assignees.length],
      dueDate: completeDate,
      createdAt: subDays(completeDate, 5),
      completedAt: completeDate,
      description: "This task is done."
    });
  }

  return tasks;
};

export const MOCK_TASKS = generateTasks();
