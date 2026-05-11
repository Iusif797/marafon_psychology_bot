import { boolean, integer, pgTable, serial, text, timestamp, bigint } from "drizzle-orm/pg-core";

export const welcomeBlocks = pgTable("welcome_blocks", {
  key: text("key").primaryKey(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const marathonSteps = pgTable("marathon_steps", {
  id: serial("id").primaryKey(),
  position: integer("position").notNull().unique(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  task: text("task").notNull().default(""),
  button: text("button").notNull().default("Далее"),
  media: text("media"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const participants = pgTable("participants", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  username: text("username"),
  fullName: text("full_name").notNull(),
  currentStep: integer("current_step").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  completed: boolean("completed").notNull().default(false),
  lastReminderAt: timestamp("last_reminder_at", { withTimezone: true }),
});

export const adminAccounts = pgTable("admin_accounts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const broadcasts = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  segment: text("segment").notNull().default("all"),
  sent: integer("sent").notNull().default(0),
  failed: integer("failed").notNull().default(0),
  blocked: integer("blocked").notNull().default(0),
  status: text("status").notNull().default("pending"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export type WelcomeBlock = typeof welcomeBlocks.$inferSelect;
export type MarathonStep = typeof marathonSteps.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type AdminAccount = typeof adminAccounts.$inferSelect;
export type Broadcast = typeof broadcasts.$inferSelect;
