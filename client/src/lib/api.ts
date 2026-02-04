import type {
  TeamMember,
  InsertTeamMember,
  Project,
  InsertProject,
  Status,
  InsertStatus,
  Priority,
  InsertPriority,
  Task,
  InsertTask,
  UpdateTask,
} from "@shared/schema";

const API_BASE = "/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Team Members
export const teamMembersAPI = {
  getAll: () => fetchAPI<TeamMember[]>("/team-members"),
  getById: (id: number) => fetchAPI<TeamMember>(`/team-members/${id}`),
  create: (member: InsertTeamMember) =>
    fetchAPI<TeamMember>("/team-members", {
      method: "POST",
      body: JSON.stringify(member),
    }),
  delete: (id: number) =>
    fetchAPI<void>(`/team-members/${id}`, { method: "DELETE" }),
};

// Projects
export const projectsAPI = {
  getAll: () => fetchAPI<Project[]>("/projects"),
  getById: (id: number) => fetchAPI<Project>(`/projects/${id}`),
  create: (project: InsertProject) =>
    fetchAPI<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    }),
  delete: (id: number) => fetchAPI<void>(`/projects/${id}`, { method: "DELETE" }),
};

// Statuses
export const statusesAPI = {
  getAll: () => fetchAPI<Status[]>("/statuses"),
  getById: (id: number) => fetchAPI<Status>(`/statuses/${id}`),
  create: (status: InsertStatus) =>
    fetchAPI<Status>("/statuses", {
      method: "POST",
      body: JSON.stringify(status),
    }),
  delete: (id: number) => fetchAPI<void>(`/statuses/${id}`, { method: "DELETE" }),
};

// Priorities
export const prioritiesAPI = {
  getAll: () => fetchAPI<Priority[]>("/priorities"),
  getById: (id: number) => fetchAPI<Priority>(`/priorities/${id}`),
  create: (priority: InsertPriority) =>
    fetchAPI<Priority>("/priorities", {
      method: "POST",
      body: JSON.stringify(priority),
    }),
  delete: (id: number) => fetchAPI<void>(`/priorities/${id}`, { method: "DELETE" }),
};

// Tasks
export const tasksAPI = {
  getAll: () => fetchAPI<Task[]>("/tasks"),
  getById: (id: number) => fetchAPI<Task>(`/tasks/${id}`),
  create: (task: InsertTask) =>
    fetchAPI<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),
  update: (id: number, task: UpdateTask) =>
    fetchAPI<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(task),
    }),
  delete: (id: number) => fetchAPI<void>(`/tasks/${id}`, { method: "DELETE" }),
};
