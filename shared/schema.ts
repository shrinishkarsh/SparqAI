import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  company: text("company"),
  website: text("website"),
  isSetupComplete: boolean("is_setup_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
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
  preferredChannels: jsonb("preferred_channels").default([]),
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
  userId: varchar("user_id").references(() => users.id),
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

export const smartleadCampaigns = pgTable("smartlead_campaigns", {
  id: serial("id").primaryKey(),
  smartleadId: integer("smartlead_id").unique().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  smartleadUserId: integer("smartlead_user_id"),
  trackSettings: text("track_settings"),
  schedulerCronValue: text("scheduler_cron_value"),
  minTimeBetweenEmails: integer("min_time_between_emails"),
  maxLeadsPerDay: integer("max_leads_per_day"),
  stopLeadSettings: text("stop_lead_settings"),
  unsubscribeText: text("unsubscribe_text"),
  clientId: integer("client_id"),
  enableAiEspMatching: boolean("enable_ai_esp_matching").default(false),
  sendAsPlainText: boolean("send_as_plain_text").default(false),
  followUpPercentage: integer("follow_up_percentage"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const smartleadLeads = pgTable("smartlead_leads", {
  id: serial("id").primaryKey(),
  smartleadId: integer("smartlead_id").unique().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  campaignId: integer("campaign_id").references(() => smartleadCampaigns.id),
  campaignLeadMapId: integer("campaign_lead_map_id"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  companyName: text("company_name"),
  website: text("website"),
  location: text("location"),
  customFields: jsonb("custom_fields").default({}),
  linkedinProfile: text("linkedin_profile"),
  companyUrl: text("company_url"),
  isUnsubscribed: boolean("is_unsubscribed").default(false),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const smartleadStats = pgTable("smartlead_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  campaignId: integer("campaign_id").references(() => smartleadCampaigns.id).notNull(),
  leadId: integer("lead_id").references(() => smartleadLeads.id).notNull(),
  leadEmail: text("lead_email").notNull(),
  sequenceNumber: integer("sequence_number"),
  emailSubject: text("email_subject"),
  emailMessage: text("email_message"),
  sentTime: timestamp("sent_time"),
  openTime: timestamp("open_time"),
  clickTime: timestamp("click_time"),
  replyTime: timestamp("reply_time"),
  unsubscribedTime: timestamp("unsubscribed_time"),
  bouncedTime: timestamp("bounced_time"),
  leadStatus: text("lead_status"),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  replyCount: integer("reply_count").default(0),
  unsubscribeCount: integer("unsubscribe_count").default(0),
  bounceCount: integer("bounce_count").default(0),
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

export const insertSmartleadCampaignSchema = createInsertSchema(smartleadCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSmartleadLeadSchema = createInsertSchema(smartleadLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSmartleadStatSchema = createInsertSchema(smartleadStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

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

export type SmartleadCampaign = typeof smartleadCampaigns.$inferSelect;
export type InsertSmartleadCampaign = z.infer<typeof insertSmartleadCampaignSchema>;

export type SmartleadLead = typeof smartleadLeads.$inferSelect;
export type InsertSmartleadLead = z.infer<typeof insertSmartleadLeadSchema>;

export type SmartleadStat = typeof smartleadStats.$inferSelect;
export type InsertSmartleadStat = z.infer<typeof insertSmartleadStatSchema>;
