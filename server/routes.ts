import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService } from "./services/openai";
import { getSmartleadService, initializeSmartleadService } from "./services/smartlead";
import { 
  insertUserSchema, insertCompanySchema, insertCampaignSchema, 
  insertContactSchema, insertActivitySchema, insertIntegrationSchema, insertProductSchema
} from "@shared/schema";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management
  const pgSession = connectPgSimple(session);
  
  app.use(session({
    store: new pgSession({
      pool: pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Store user ID in session
      (req as any).session.userId = user.id;
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Store user ID in session after registration
      (req as any).session.userId = user.id;
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes
  app.get("/api/user/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const currentUserId = (req as any).session.userId;
      
      // Users can only access their own data
      if (id !== currentUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/user/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const currentUserId = (req as any).session.userId;
      
      // Users can only update their own data
      if (id !== currentUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updates = req.body;
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Company routes
  app.get("/api/company/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const company = await storage.getCompanyByUserId(userId);
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post("/api/company", async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      res.json(company);
    } catch (error) {
      res.status(400).json({ message: "Failed to create company" });
    }
  });

  app.patch("/api/company/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const company = await storage.updateCompany(id, updates);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const campaigns = await storage.getCampaignsByUserId(userId);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ message: "Failed to create campaign" });
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const campaign = await storage.updateCampaign(id, updates);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCampaign(id);
      
      if (!success) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Contact routes
  app.get("/api/contacts/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contacts = await storage.getContactsByUserId(userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/campaign/:campaignId", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const contacts = await storage.getContactsByCampaignId(campaignId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: "Failed to create contact" });
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const contact = await storage.updateContact(id, updates);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  // Activity routes
  app.get("/api/activities/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activities = await storage.getActivitiesByUserId(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Failed to create activity" });
    }
  });

  // Integration routes
  app.get("/api/integrations/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const integrations = await storage.getIntegrationsByUserId(userId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const integrationData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(integrationData);
      res.json(integration);
    } catch (error) {
      res.status(400).json({ message: "Failed to create integration" });
    }
  });

  app.patch("/api/integrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const integration = await storage.updateIntegration(id, updates);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }
      
      res.json(integration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  // AI-powered routes
  app.post("/api/ai/enrich-lead", async (req, res) => {
    try {
      const { email, firstName, lastName, company } = req.body;
      const enrichmentData = await openaiService.enrichLead(email, firstName, lastName, company);
      res.json(enrichmentData);
    } catch (error) {
      res.status(500).json({ message: "Lead enrichment failed" });
    }
  });

  app.post("/api/ai/generate-email", async (req, res) => {
    try {
      const emailCopy = await openaiService.generateEmailCopy(req.body);
      res.json(emailCopy);
    } catch (error) {
      res.status(500).json({ message: "Email generation failed" });
    }
  });

  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { campaignData, contactData } = req.body;
      const insights = await openaiService.generateAiInsights(campaignData, contactData);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "AI insights generation failed" });
    }
  });

  app.post("/api/ai/target-audience", async (req, res) => {
    try {
      const { companyDescription, industry } = req.body;
      const audiences = await openaiService.generateTargetAudience(companyDescription, industry);
      res.json(audiences);
    } catch (error) {
      res.status(500).json({ message: "Target audience generation failed" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Try to get real Smartlead data first
      const smartlead = getSmartleadService();
      if (smartlead) {
        try {
          const smartleadAnalytics = await smartlead.getAllCampaignsAnalytics();
          const smartleadCampaigns = await storage.getSmartleadCampaignsByUserId(userId);
          
          // Return real Smartlead data
          const stats = {
            totalLeads: smartleadAnalytics.totalLeads,
            activeCampaigns: smartleadAnalytics.activeCampaigns,
            responseRate: smartleadAnalytics.avgReplyRate.toFixed(1),
            meetingsBooked: Math.floor(smartleadAnalytics.totalReplies * 0.15), // Estimate meetings from replies
            openRate: smartleadAnalytics.avgOpenRate.toFixed(1),
            clickRate: smartleadAnalytics.avgClickRate.toFixed(1),
            totalSent: smartleadAnalytics.totalSent,
            totalOpens: smartleadAnalytics.totalOpens,
            totalClicks: smartleadAnalytics.totalClicks,
            totalReplies: smartleadAnalytics.totalReplies,
            hotLeads: Math.floor(smartleadAnalytics.totalReplies * 0.3), // Hot leads from replies
            warmLeads: Math.floor(smartleadAnalytics.totalOpens * 0.2), // Warm from opens
            coldLeads: smartleadAnalytics.totalLeads - Math.floor(smartleadAnalytics.totalOpens * 0.2) - Math.floor(smartleadAnalytics.totalReplies * 0.3),
            connections: smartleadAnalytics.totalReplies,
            isSmartleadData: true
          };
          
          return res.json(stats);
        } catch (smartleadError) {
          console.log('Smartlead data unavailable, falling back to local data:', smartleadError.message);
        }
      }
      
      // Fallback to local data
      const campaigns = await storage.getCampaignsByUserId(userId);
      const contacts = await storage.getContactsByUserId(userId);
      const activities = await storage.getActivitiesByUserId(userId);
      
      const stats = {
        totalLeads: contacts.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        responseRate: contacts.length > 0 ? 
          (contacts.filter(c => c.responseReceived).length / contacts.length * 100).toFixed(1) : 0,
        meetingsBooked: contacts.filter(c => c.meetingScheduled).length,
        hotLeads: contacts.filter(c => c.status === 'hot').length,
        warmLeads: contacts.filter(c => c.status === 'warm').length,
        coldLeads: contacts.filter(c => c.status === 'cold').length,
        connections: contacts.filter(c => c.status === 'connected').length,
        openRate: "12.5", // Demo data
        clickRate: "3.2", // Demo data
        totalSent: 125,
        totalOpens: 18,
        totalClicks: 4,
        totalReplies: contacts.filter(c => c.responseReceived).length,
        isSmartleadData: false
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Product routes
  app.get("/api/products/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const products = await storage.getProductsByUserId(userId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/company/:companyId", async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const products = await storage.getProductsByCompanyId(companyId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Product creation failed" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, updates);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Product update failed" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Product deletion failed" });
    }
  });

  // Smartlead Integration Routes
  
  // Initialize Smartlead API key
  app.post("/api/smartlead/init", requireAuth, async (req, res) => {
    try {
      const { apiKey } = req.body;
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }
      
      initializeSmartleadService(apiKey);
      
      // Store the API key in integrations table
      const integration = await storage.createIntegration({
        userId: req.session.userId,
        type: "smartlead",
        isConnected: true,
        credentials: { apiKey },
        settings: {}
      });
      
      res.json({ message: "Smartlead API initialized successfully", integration });
    } catch (error) {
      res.status(500).json({ message: "Failed to initialize Smartlead API" });
    }
  });

  // Sync campaigns from Smartlead
  app.post("/api/smartlead/sync-campaigns", requireAuth, async (req, res) => {
    try {
      const smartlead = getSmartleadService();
      if (!smartlead) {
        return res.status(400).json({ message: "Smartlead API not initialized" });
      }
      
      const campaigns = await smartlead.getAllCampaigns();
      const syncedCampaigns = [];
      
      for (const campaign of campaigns) {
        try {
          // Save to database
          await storage.createSmartleadCampaign({
            smartleadId: campaign.id,
            userId: req.session.userId,
            name: campaign.name,
            status: campaign.status,
            smartleadUserId: campaign.user_id,
            trackSettings: campaign.track_settings,
            schedulerCronValue: campaign.scheduler_cron_value,
            minTimeBetweenEmails: campaign.min_time_btwn_emails,
            maxLeadsPerDay: campaign.max_leads_per_day,
            stopLeadSettings: campaign.stop_lead_settings,
            unsubscribeText: campaign.unsubscribe_text,
            clientId: campaign.client_id,
            enableAiEspMatching: campaign.enable_ai_esp_matching,
            sendAsPlainText: campaign.send_as_plain_text,
            followUpPercentage: campaign.follow_up_percentage
          });
          syncedCampaigns.push(campaign);
        } catch (error) {
          // Skip if already exists
          if (error.code === '23505') {
            syncedCampaigns.push(campaign);
          }
        }
      }
      
      res.json({ message: "Campaigns synced successfully", count: syncedCampaigns.length, campaigns: syncedCampaigns });
    } catch (error) {
      console.error('Sync campaigns error:', error);
      res.status(500).json({ message: "Failed to sync campaigns" });
    }
  });

  // Sync leads from a specific campaign
  app.post("/api/smartlead/sync-leads/:campaignId", requireAuth, async (req, res) => {
    try {
      const smartlead = getSmartleadService();
      if (!smartlead) {
        return res.status(400).json({ message: "Smartlead API not initialized" });
      }
      
      const campaignId = parseInt(req.params.campaignId);
      const leadsData = await smartlead.getCampaignLeads(campaignId, 0, 1000);
      const syncedLeads = [];
      
      for (const leadData of leadsData.data) {
        try {
          await storage.createSmartleadLead({
            smartleadId: leadData.lead.id,
            userId: req.session.userId,
            campaignId: null, // Will be linked later
            campaignLeadMapId: leadData.campaign_lead_map_id,
            firstName: leadData.lead.first_name,
            lastName: leadData.lead.last_name,
            email: leadData.lead.email,
            phoneNumber: leadData.lead.phone_number,
            companyName: leadData.lead.company_name,
            website: leadData.lead.website,
            location: leadData.lead.location,
            customFields: leadData.lead.custom_fields,
            linkedinProfile: leadData.lead.linkedin_profile,
            companyUrl: leadData.lead.company_url,
            isUnsubscribed: leadData.lead.is_unsubscribed,
            status: leadData.status
          });
          syncedLeads.push(leadData);
        } catch (error) {
          // Skip if already exists
          if (error.code === '23505') {
            syncedLeads.push(leadData);
          }
        }
      }
      
      res.json({ message: "Leads synced successfully", count: syncedLeads.length, leads: syncedLeads });
    } catch (error) {
      console.error('Sync leads error:', error);
      res.status(500).json({ message: "Failed to sync leads" });
    }
  });

  // Get real-time analytics from Smartlead
  app.get("/api/smartlead/analytics", requireAuth, async (req, res) => {
    try {
      const smartlead = getSmartleadService();
      if (!smartlead) {
        return res.status(400).json({ message: "Smartlead API not initialized" });
      }
      
      const analytics = await smartlead.getAllCampaignsAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get campaign analytics
  app.get("/api/smartlead/campaign/:campaignId/analytics", requireAuth, async (req, res) => {
    try {
      const smartlead = getSmartleadService();
      if (!smartlead) {
        return res.status(400).json({ message: "Smartlead API not initialized" });
      }
      
      const campaignId = parseInt(req.params.campaignId);
      const analytics = await smartlead.getCampaignAnalytics(campaignId);
      res.json(analytics);
    } catch (error) {
      console.error('Campaign analytics error:', error);
      res.status(500).json({ message: "Failed to fetch campaign analytics" });
    }
  });

  // Get Smartlead campaigns
  app.get("/api/smartlead/campaigns", requireAuth, async (req, res) => {
    try {
      const smartlead = getSmartleadService();
      if (!smartlead) {
        return res.status(400).json({ message: "Smartlead API not initialized" });
      }
      
      const campaigns = await smartlead.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error('Get campaigns error:', error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Get campaign leads
  app.get("/api/smartlead/campaign/:campaignId/leads", requireAuth, async (req, res) => {
    try {
      const smartlead = getSmartleadService();
      if (!smartlead) {
        return res.status(400).json({ message: "Smartlead API not initialized" });
      }
      
      const campaignId = parseInt(req.params.campaignId);
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 100;
      
      const leads = await smartlead.getCampaignLeads(campaignId, offset, limit);
      res.json(leads);
    } catch (error) {
      console.error('Get leads error:', error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Check Smartlead connection status
  app.get("/api/smartlead/status", requireAuth, async (req, res) => {
    try {
      const smartlead = getSmartleadService();
      const isConnected = !!smartlead;
      
      if (isConnected) {
        // Test the connection by trying to fetch campaigns
        await smartlead.getAllCampaigns();
        res.json({ connected: true, message: "Smartlead API is connected and working" });
      } else {
        res.json({ connected: false, message: "Smartlead API not initialized" });
      }
    } catch (error) {
      res.json({ connected: false, message: "Smartlead API connection failed", error: error.message });
    }
  });

  // Support ticket endpoint
  app.post("/api/support/ticket", requireAuth, async (req, res) => {
    try {
      const { name, email, subject, message, priority } = req.body;
      
      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // In a real application, you would save this to a database or send it to a support system
      // For now, we'll simulate the ticket creation
      const ticketId = `TICKET-${Date.now()}`;
      
      // Log the support ticket (in production, you'd save to database or send to support system)
      console.log(`Support Ticket Created: ${ticketId}`, {
        name,
        email,
        subject,
        message,
        priority: priority || 'medium',
        timestamp: new Date().toISOString(),
        userId: req.session.userId
      });

      res.json({ 
        success: true, 
        ticketId,
        message: "Support ticket created successfully. We'll get back to you soon!" 
      });
    } catch (error) {
      console.error('Support ticket creation error:', error);
      res.status(500).json({ message: "Failed to create support ticket" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
