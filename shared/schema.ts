import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (keeping for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Optimization history model
export const optimizationHistory = pgTable("optimization_history", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  originalText: text("original_text").notNull(),
  optimizedText: text("optimized_text").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  style: text("style"),
  websiteType: text("website_type"),
  designStyle: text("design_style"),
});

export const insertOptimizationHistorySchema = createInsertSchema(optimizationHistory).omit({
  timestamp: true,
});

export type InsertOptimizationItem = z.infer<typeof insertOptimizationHistorySchema>;
export type OptimizationItem = typeof optimizationHistory.$inferSelect;
