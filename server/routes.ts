import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { openaiService } from "./services/openai";
import { getSmartleadService, initializeSmartleadService } from "./services/smartlead";
import { 
  insertUserSchema, insertCompanySchema, insertCampaignSchema, 
  insertContactSchema, insertActivitySchema, insertIntegrationSchema, insertProductSchema
} from "@shared/schema";
import { login, register, logout, isAuthenticated } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Custom authentication routes

  // Priority middleware for API routes - must run before Vite catch-all
  app.use('/api', (req, res, next) => {
    // Mark this as an API route to prevent HTML fallback
    res.locals.isApiRoute = true;
    next();
  });

  // Health check route (no auth required)
  app.get('/api/health', (req, res) => {
    console.log('Health check route hit');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Favicon route (no auth required)
  app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../attached_assets/favicon_1751704644486.ico'));
  });

  // Authentication routes
  app.post('/api/auth/login', login);
  app.post('/api/auth/register', register);
  app.post('/api/auth/logout', logout);
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes
  app.get("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const user = await storage.updateUser(userId, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Setup completion endpoint
  app.post("/api/users/:id/setup", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const currentUserId = req.session.userId;
      
      // Only allow users to update their own setup status
      if (userId !== currentUserId) {
        return res.status(403).json({ message: "Forbidden: Can only update own setup status" });
      }
      
      const user = await storage.updateUser(userId, { isSetupComplete: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error completing setup:", error);
      res.status(500).json({ message: "Failed to complete setup" });
    }
  });

  // Company routes
  app.get("/api/users/:userId/company", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const company = await storage.getCompanyByUserId(userId);
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post("/api/companies", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.patch("/api/companies/:id", isAuthenticated, async (req, res) => {
    try {
      const companyId = parseInt(req.params.id);
      const updateData = req.body;
      const company = await storage.updateCompany(companyId, updateData);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  // Campaign routes
  app.get("/api/users/:userId/campaigns", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const campaigns = await storage.getCampaignsByUserId(userId);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.get("/api/campaigns/:id", isAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.patch("/api/campaigns/:id", isAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const updateData = req.body;
      const campaign = await storage.updateCampaign(campaignId, updateData);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", isAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const success = await storage.deleteCampaign(campaignId);
      if (!success) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Contact routes
  app.get("/api/users/:userId/contacts", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contacts = await storage.getContactsByUserId(userId);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.get("/api/campaigns/:campaignId/contacts", isAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const contacts = await storage.getContactsByCampaignId(campaignId);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching campaign contacts:", error);
      res.status(500).json({ message: "Failed to fetch campaign contacts" });
    }
  });

  app.post("/api/contacts", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.patch("/api/contacts/:id", isAuthenticated, async (req, res) => {
    try {
      const contactId = parseInt(req.params.id);
      const updateData = req.body;
      const contact = await storage.updateContact(contactId, updateData);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", isAuthenticated, async (req, res) => {
    try {
      const contactId = parseInt(req.params.id);
      const success = await storage.deleteContact(contactId);
      if (!success) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Activity routes
  app.get("/api/users/:userId/activities", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activities = await storage.getActivitiesByUserId(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Integration routes
  app.get("/api/users/:userId/integrations", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const integrations = await storage.getIntegrationsByUserId(userId);
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.get("/api/users/:userId/integrations/:type", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const type = req.params.type;
      const integration = await storage.getIntegrationByType(userId, type);
      res.json(integration);
    } catch (error) {
      console.error("Error fetching integration:", error);
      res.status(500).json({ message: "Failed to fetch integration" });
    }
  });

  app.post("/api/integrations", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      console.error("Error creating integration:", error);
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.patch("/api/integrations/:id", isAuthenticated, async (req, res) => {
    try {
      const integrationId = parseInt(req.params.id);
      const updateData = req.body;
      const integration = await storage.updateIntegration(integrationId, updateData);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      console.error("Error updating integration:", error);
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  // Product routes
  app.get("/api/users/:userId/products", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const products = await storage.getProductsByUserId(userId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updateData = req.body;
      const product = await storage.updateProduct(productId, updateData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const success = await storage.deleteProduct(productId);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // AI Service routes
  app.post("/api/ai/enrich-lead", isAuthenticated, async (req, res) => {
    try {
      const { contactData } = req.body;
      const enrichedData = await openaiService.enrichLead(contactData);
      res.json(enrichedData);
    } catch (error) {
      console.error("Error enriching lead:", error);
      res.status(500).json({ message: "Failed to enrich lead" });
    }
  });

  app.post("/api/ai/generate-email", isAuthenticated, async (req, res) => {
    try {
      const { contactData, campaignData, templateType } = req.body;
      const emailContent = await openaiService.generateEmailContent(contactData, campaignData, templateType);
      res.json({ content: emailContent });
    } catch (error) {
      console.error("Error generating email:", error);
      res.status(500).json({ message: "Failed to generate email" });
    }
  });

  app.post("/api/ai/score-lead", isAuthenticated, async (req, res) => {
    try {
      const { contactData, campaignData } = req.body;
      const score = await openaiService.scoreLead(contactData, campaignData);
      res.json({ score });
    } catch (error) {
      console.error("Error scoring lead:", error);
      res.status(500).json({ message: "Failed to score lead" });
    }
  });

  app.post("/api/ai/optimize-campaign", isAuthenticated, async (req, res) => {
    try {
      const { campaignData } = req.body;
      const suggestions = await openaiService.optimizeCampaign(campaignData);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error optimizing campaign:", error);
      res.status(500).json({ message: "Failed to optimize campaign" });
    }
  });

  // Smartlead integration routes
  app.post("/api/smartlead/sync", isAuthenticated, async (req, res) => {
    try {
      const { userId, apiKey } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }

      await initializeSmartleadService(apiKey);
      const smartleadService = getSmartleadService();

      // Sync campaigns
      const campaigns = await smartleadService.getCampaigns();
      for (const campaign of campaigns) {
        // Store in database
        await storage.createSmartleadCampaign({
          smartleadCampaignId: campaign.id,
          name: campaign.name,
          status: campaign.status,
          userId: parseInt(userId),
          data: campaign
        });
      }

      res.json({ message: "Sync completed successfully", campaigns: campaigns.length });
    } catch (error) {
      console.error("Smartlead sync error:", error);
      res.status(500).json({ message: "Failed to sync with Smartlead" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}