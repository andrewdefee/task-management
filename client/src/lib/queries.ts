import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  teamMembersAPI,
  projectsAPI,
  statusesAPI,
  prioritiesAPI,
  tasksAPI,
} from "./api";
import type { InsertTask, UpdateTask } from "@shared/schema";

// Query keys
export const queryKeys = {
  teamMembers: ["teamMembers"] as const,
  projects: ["projects"] as const,
  statuses: ["statuses"] as const,
  priorities: ["priorities"] as const,
  tasks: ["tasks"] as const,
};

// Team Members
export function useTeamMembers() {
  return useQuery({
    queryKey: queryKeys.teamMembers,
    queryFn: teamMembersAPI.getAll,
  });
}

// Projects
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: projectsAPI.getAll,
  });
}

// Statuses
export function useStatuses() {
  return useQuery({
    queryKey: queryKeys.statuses,
    queryFn: statusesAPI.getAll,
  });
}

// Priorities
export function usePriorities() {
  return useQuery({
    queryKey: queryKeys.priorities,
    queryFn: prioritiesAPI.getAll,
  });
}

// Tasks
export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: tasksAPI.getAll,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: InsertTask) => tasksAPI.create(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: UpdateTask }) =>
      tasksAPI.update(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tasksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
}
