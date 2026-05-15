import { boolean, integer, numeric, pgTable, serial, text, timestamp, bigint } from "drizzle-orm/pg-core";

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
  attachmentFile: text("attachment_file"),
  attachmentCaption: text("attachment_caption"),
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
  paid: boolean("paid").notNull().default(false),
  paidAt: timestamp("paid_at", { withTimezone: true }),
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

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  provider: text("provider").notNull().default("payriff"),
  status: text("status").notNull().default("pending"),
  paymentUrl: text("payment_url"),
  transactionId: bigint("transaction_id", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const paymentSettings = pgTable("payment_settings", {
  id: integer("id").primaryKey().default(1),
  enabled: boolean("enabled").notNull().default(true),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("60"),
  currency: text("currency").notNull().default("USD"),
  paywallText: text("paywall_text").notNull().default(""),
  payButtonText: text("pay_button_text").notNull().default("Оплатить и начать"),
  successText: text("success_text").notNull().default("Оплата прошла. Поехали!"),
  welcomeFile: text("welcome_file"),
  welcomeCaption: text("welcome_caption"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WelcomeBlock = typeof welcomeBlocks.$inferSelect;
export type MarathonStep = typeof marathonSteps.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type AdminAccount = typeof adminAccounts.$inferSelect;
export type Broadcast = typeof broadcasts.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type PaymentSettings = typeof paymentSettings.$inferSelect;
