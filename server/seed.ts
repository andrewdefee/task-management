import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("Seeding database...");

  try {
    // Check if data already exists
    const existingStatuses = await db.select().from(schema.statuses);
    if (existingStatuses.length > 0) {
      console.log("Database already seeded, skipping...");
      await pool.end();
      return;
    }

    // Seed statuses
    const statuses = await db
      .insert(schema.statuses)
      .values([
        { name: "Todo", order: 1 },
        { name: "In Progress", order: 2 },
        { name: "In Review", order: 3 },
        { name: "Blocked", order: 4 },
        { name: "Completed", order: 5 },
      ])
      .returning();

    console.log(`Created ${statuses.length} statuses`);

    // Seed priorities
    const priorities = await db
      .insert(schema.priorities)
      .values([
        { name: "Low", order: 1 },
        { name: "Medium", order: 2 },
        { name: "High", order: 3 },
        { name: "Critical", order: 4 },
      ])
      .returning();

    console.log(`Created ${priorities.length} priorities`);

    // Seed team members
    const teamMembers = await db
      .insert(schema.teamMembers)
      .values([
        { name: "Sarah Chen", role: "Product Manager" },
        { name: "Michael Rodriguez", role: "Engineering Lead" },
        { name: "Emily Watson", role: "Senior Developer" },
        { name: "David Kim", role: "UX Designer" },
        { name: "Jennifer Liu", role: "Marketing Director" },
        { name: "Robert Johnson", role: "Data Analyst" },
      ])
      .returning();

    console.log(`Created ${teamMembers.length} team members`);

    // Seed projects
    const projects = await db
      .insert(schema.projects)
      .values([
        { name: "Platform Redesign" },
        { name: "Mobile App v2.0" },
        { name: "API Integration" },
        { name: "Customer Portal" },
        { name: "Analytics Dashboard" },
      ])
      .returning();

    console.log(`Created ${projects.length} projects`);

    // Seed sample tasks
    const todoStatus = statuses.find((s) => s.name === "Todo")!;
    const inProgressStatus = statuses.find((s) => s.name === "In Progress")!;
    const inReviewStatus = statuses.find((s) => s.name === "In Review")!;
    const completedStatus = statuses.find((s) => s.name === "Completed")!;

    const highPriority = priorities.find((p) => p.name === "High")!;
    const mediumPriority = priorities.find((p) => p.name === "Medium")!;
    const criticalPriority = priorities.find((p) => p.name === "Critical")!;

    const tasks = await db
      .insert(schema.tasks)
      .values([
        {
          title: "Design new landing page",
          description: "Create mockups for the new homepage design focusing on conversion optimization",
          projectId: projects[0].id,
          statusId: inProgressStatus.id,
          priorityId: highPriority.id,
          assigneeId: teamMembers[3].id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          title: "Implement authentication flow",
          description: "Build OAuth 2.0 integration for social login",
          projectId: projects[1].id,
          statusId: todoStatus.id,
          priorityId: criticalPriority.id,
          assigneeId: teamMembers[2].id,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        {
          title: "API documentation update",
          description: "Update API docs for v3 endpoints",
          projectId: projects[2].id,
          statusId: inReviewStatus.id,
          priorityId: mediumPriority.id,
          assigneeId: teamMembers[1].id,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
          title: "Setup analytics tracking",
          description: "Integrate Google Analytics and custom event tracking",
          projectId: projects[4].id,
          statusId: todoStatus.id,
          priorityId: highPriority.id,
          assigneeId: teamMembers[5].id,
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
        {
          title: "User testing sessions",
          description: "Conduct 10 user interviews for the new portal design",
          projectId: projects[3].id,
          statusId: completedStatus.id,
          priorityId: mediumPriority.id,
          assigneeId: teamMembers[0].id,
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          title: "Database migration script",
          description: "Write migration for new customer data schema",
          projectId: projects[3].id,
          statusId: inProgressStatus.id,
          priorityId: criticalPriority.id,
          assigneeId: teamMembers[2].id,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      ])
      .returning();

    console.log(`Created ${tasks.length} sample tasks`);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
