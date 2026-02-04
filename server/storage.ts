import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { eq, and, desc } from "drizzle-orm";
import * as schema from "@shared/schema";
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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

export interface IStorage {
  // Team Members
  getAllTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Statuses
  getAllStatuses(): Promise<Status[]>;
  getStatus(id: number): Promise<Status | undefined>;
  createStatus(status: InsertStatus): Promise<Status>;
  deleteStatus(id: number): Promise<void>;

  // Priorities
  getAllPriorities(): Promise<Priority[]>;
  getPriority(id: number): Promise<Priority | undefined>;
  createPriority(priority: InsertPriority): Promise<Priority>;
  deletePriority(id: number): Promise<void>;

  // Tasks
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Team Members
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(schema.teamMembers);
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const result = await db
      .select()
      .from(schema.teamMembers)
      .where(eq(schema.teamMembers.id, id))
      .limit(1);
    return result[0];
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const result = await db.insert(schema.teamMembers).values(member).returning();
    return result[0];
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, id));
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return db.select().from(schema.projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, id))
      .limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(schema.projects).values(project).returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
  }

  // Statuses
  async getAllStatuses(): Promise<Status[]> {
    return db.select().from(schema.statuses).orderBy(schema.statuses.order);
  }

  async getStatus(id: number): Promise<Status | undefined> {
    const result = await db
      .select()
      .from(schema.statuses)
      .where(eq(schema.statuses.id, id))
      .limit(1);
    return result[0];
  }

  async createStatus(status: InsertStatus): Promise<Status> {
    const result = await db.insert(schema.statuses).values(status).returning();
    return result[0];
  }

  async deleteStatus(id: number): Promise<void> {
    await db.delete(schema.statuses).where(eq(schema.statuses.id, id));
  }

  // Priorities
  async getAllPriorities(): Promise<Priority[]> {
    return db.select().from(schema.priorities).orderBy(schema.priorities.order);
  }

  async getPriority(id: number): Promise<Priority | undefined> {
    const result = await db
      .select()
      .from(schema.priorities)
      .where(eq(schema.priorities.id, id))
      .limit(1);
    return result[0];
  }

  async createPriority(priority: InsertPriority): Promise<Priority> {
    const result = await db.insert(schema.priorities).values(priority).returning();
    return result[0];
  }

  async deletePriority(id: number): Promise<void> {
    await db.delete(schema.priorities).where(eq(schema.priorities.id, id));
  }

  // Tasks
  async getAllTasks(): Promise<Task[]> {
    return db.select().from(schema.tasks).orderBy(desc(schema.tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const result = await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, id))
      .limit(1);
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(schema.tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: number, task: UpdateTask): Promise<Task | undefined> {
    const result = await db
      .update(schema.tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(schema.tasks.id, id))
      .returning();
    return result[0];
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(schema.tasks).where(eq(schema.tasks.id, id));
  }
}

export const storage = new DatabaseStorage();
