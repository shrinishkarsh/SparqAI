import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  website: text("website"),
  isSetupComplete: boolean("is_setup_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  website: text("website"),
  description: text("description"),
  industry: text("industry"),
  size: text("size"),
  targetIcp: text("target_icp"),
  // Enhanced company setup fields
  targetMarket: text("target_market"),
  valueProposition: text("value_proposition"),
  idealCustomerProfile: text("ideal_customer_profile"),
  companyGoals: text("company_goals"),
  salesProcess: text("sales_process"),
  competitiveAdvantage: text("competitive_advantage"),
  revenueModel: text("revenue_model"),
  geographicFocus: text("geographic_focus"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  companyId: integer("company_id").references(() => companies.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  price: text("price"),
  features: jsonb("features").default([]),
  targetAudience: text("target_audience"),
  useCases: jsonb("use_cases").default([]),
  benefits: jsonb("benefits").default([]),
  competitiveAdvantage: text("competitive_advantage"),
  salesPoints: jsonb("sales_points").default([]),
  documentationUrl: text("documentation_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  companyId: integer("company_id").references(() => companies.id),
  productId: integer("product_id").references(() => products.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // draft, active, paused, completed
  targetAudience: text("target_audience"),
  messageTemplate: text("message_template"),
  sequences: jsonb("sequences").default([]),
  stats: jsonb("stats").default({}),
  // Enhanced campaign fields
  channels: jsonb("channels").default([]), // email, linkedin, both
  listSource: text("list_source").default("upload"), // upload, ai_generated
  strategy: text("strategy"), // outreach strategy
  totalContacts: integer("total_contacts").default(0),
  sentMessages: integer("sent_messages").default(0),
  responses: integer("responses").default(0),
  meetings: integer("meetings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  industry: text("industry"),
  companySize: text("company_size"),
  linkedinUrl: text("linkedin_url"),
  status: text("status").notNull().default("cold"), // cold, warm, hot, connected, unqualified
  lastContactedAt: timestamp("last_contacted_at"),
  responseReceived: boolean("response_received").default(false),
  meetingScheduled: boolean("meeting_scheduled").default(false),
  enrichmentData: jsonb("enrichment_data").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  contactId: integer("contact_id").references(() => contacts.id),
  type: text("type").notNull(), // email_sent, response_received, meeting_scheduled, etc.
  description: text("description").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // linkedin, email, crm
  isConnected: boolean("is_connected").default(false),
  credentials: jsonb("credentials").default({}),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
