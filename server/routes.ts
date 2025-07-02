import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService } from "./services/openai";
import { 
  insertUserSchema, insertCompanySchema, insertCampaignSchema, 
  insertContactSchema, insertActivitySchema, insertIntegrationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (simplified for demo)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
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
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/user/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
