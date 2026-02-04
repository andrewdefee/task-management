import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertTeamMemberSchema,
  insertProjectSchema,
  insertStatusSchema,
  insertPrioritySchema,
  insertTaskSchema,
  updateTaskSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Team Members
  app.get("/api/team-members", async (_req, res) => {
    const members = await storage.getAllTeamMembers();
    res.json(members);
  });

  app.get("/api/team-members/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const member = await storage.getTeamMember(id);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json(member);
  });

  app.post("/api/team-members", async (req, res) => {
    const result = insertTeamMemberSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const member = await storage.createTeamMember(result.data);
    res.status(201).json(member);
  });

  app.delete("/api/team-members/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTeamMember(id);
    res.status(204).send();
  });

  // Projects
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  });

  app.post("/api/projects", async (req, res) => {
    const result = insertProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const project = await storage.createProject(result.data);
    res.status(201).json(project);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProject(id);
    res.status(204).send();
  });

  // Statuses
  app.get("/api/statuses", async (_req, res) => {
    const statuses = await storage.getAllStatuses();
    res.json(statuses);
  });

  app.get("/api/statuses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const status = await storage.getStatus(id);
    if (!status) {
      return res.status(404).json({ error: "Status not found" });
    }
    res.json(status);
  });

  app.post("/api/statuses", async (req, res) => {
    const result = insertStatusSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const status = await storage.createStatus(result.data);
    res.status(201).json(status);
  });

  app.delete("/api/statuses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteStatus(id);
    res.status(204).send();
  });

  // Priorities
  app.get("/api/priorities", async (_req, res) => {
    const priorities = await storage.getAllPriorities();
    res.json(priorities);
  });

  app.get("/api/priorities/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const priority = await storage.getPriority(id);
    if (!priority) {
      return res.status(404).json({ error: "Priority not found" });
    }
    res.json(priority);
  });

  app.post("/api/priorities", async (req, res) => {
    const result = insertPrioritySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const priority = await storage.createPriority(result.data);
    res.status(201).json(priority);
  });

  app.delete("/api/priorities/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deletePriority(id);
    res.status(204).send();
  });

  // Tasks
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getAllTasks();
    res.json(tasks);
  });

  app.get("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const task = await storage.getTask(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const task = await storage.createTask(result.data);
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = updateTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const task = await storage.updateTask(id, result.data);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTask(id);
    res.status(204).send();
  });

  return httpServer;
}
