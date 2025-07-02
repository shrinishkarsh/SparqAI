import { 
  users, companies, campaigns, contacts, activities, integrations,
  type User, type InsertUser, type Company, type InsertCompany,
  type Campaign, type InsertCampaign, type Contact, type InsertContact,
  type Activity, type InsertActivity, type Integration, type InsertIntegration
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByUserId(userId: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;

  // Campaign operations
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaignsByUserId(userId: number): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;

  // Contact operations
  getContact(id: number): Promise<Contact | undefined>;
  getContactsByUserId(userId: number): Promise<Contact[]>;
  getContactsByCampaignId(campaignId: number): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;

  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByUserId(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Integration operations
  getIntegration(id: number): Promise<Integration | undefined>;
  getIntegrationsByUserId(userId: number): Promise<Integration[]>;
  getIntegrationByType(userId: number, type: string): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: number, integration: Partial<InsertIntegration>): Promise<Integration | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private companies: Map<number, Company> = new Map();
  private campaigns: Map<number, Campaign> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private activities: Map<number, Activity> = new Map();
  private integrations: Map<number, Integration> = new Map();
  
  private currentUserId = 1;
  private currentCompanyId = 1;
  private currentCampaignId = 1;
  private currentContactId = 1;
  private currentActivityId = 1;
  private currentIntegrationId = 1;

  constructor() {
    // Initialize with demo user
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoUser: User = {
      id: 1,
      username: "demo",
      password: "demo123",
      email: "alex@company.com",
      firstName: "Alex",
      lastName: "Johnson",
      company: "SparqAI Demo",
      website: "https://sparqai.com",
      isSetupComplete: true,
      createdAt: new Date(),
    };
    this.users.set(1, demoUser);
    this.currentUserId = 2;

    const demoCompany: Company = {
      id: 1,
      userId: 1,
      name: "SparqAI Demo Company",
      website: "https://sparqai.com",
      description: "AI-powered sales development platform",
      industry: "SaaS",
      size: "11-50 employees",
      targetIcp: "Mid-market SaaS companies with 100-500 employees",
      createdAt: new Date(),
    };
    this.companies.set(1, demoCompany);
    this.currentCompanyId = 2;

    // Initialize demo campaigns, contacts, and activities
    this.initializeDemoCampaigns();
    this.initializeDemoContacts();
    this.initializeDemoActivities();
    this.initializeDemoIntegrations();
  }

  private initializeDemoCampaigns() {
    const campaigns = [
      {
        id: 1,
        userId: 1,
        companyId: 1,
        name: "Enterprise Security Solutions",
        description: "Targeting IT Directors at mid-market companies for cybersecurity solutions",
        status: "active",
        targetAudience: "IT Directors, CISOs, CTOs",
        messageTemplate: "Hi {{firstName}}, I noticed {{company}} is growing rapidly. Are you evaluating new security solutions?",
        sequences: [
          { step: 1, type: "email", template: "Initial outreach", delay: 0 },
          { step: 2, type: "linkedin", template: "LinkedIn connection", delay: 3 },
          { step: 3, type: "email", template: "Follow-up email", delay: 7 }
        ],
        stats: { sent: 847, opened: 423, replied: 198, meetings: 12 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        companyId: 1,
        name: "Financial Services Outreach",
        description: "Targeting CFOs and finance leaders at fintech companies",
        status: "active",
        targetAudience: "CFOs, Finance Directors, VPs of Finance",
        messageTemplate: "Hello {{firstName}}, I saw {{company}}'s recent funding news. Congratulations!",
        sequences: [
          { step: 1, type: "email", template: "Congratulations message", delay: 0 },
          { step: 2, type: "email", template: "Value proposition", delay: 5 }
        ],
        stats: { sent: 432, opened: 287, replied: 85, meetings: 8 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        companyId: 1,
        name: "Healthcare Innovation",
        description: "Targeting healthcare technology leaders",
        status: "launching",
        targetAudience: "CTOs, VPs of Product, Healthcare Executives",
        messageTemplate: "Hi {{firstName}}, I'm reaching out about {{company}}'s digital transformation initiatives.",
        sequences: [
          { step: 1, type: "email", template: "Digital transformation", delay: 0 }
        ],
        stats: { sent: 0, opened: 0, replied: 0, meetings: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    campaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign as Campaign);
    });
    this.currentCampaignId = 4;
  }

  private initializeDemoContacts() {
    const contacts = [
      {
        id: 1,
        userId: 1,
        campaignId: 1,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@techcorp.com",
        phone: "(555) 123-4567",
        company: "TechCorp Inc.",
        jobTitle: "IT Director",
        industry: "Technology",
        companySize: "500-1000 employees",
        linkedinUrl: "https://linkedin.com/in/sarah-johnson",
        status: "hot",
        lastContactedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        responseReceived: true,
        meetingScheduled: false,
        enrichmentData: { companyRevenue: "$50M-$100M", technologies: ["AWS", "Salesforce"] },
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        campaignId: 2,
        firstName: "Michael",
        lastName: "Chen",
        email: "michael@dataflow.com",
        phone: "(555) 234-5678",
        company: "DataFlow Inc.",
        jobTitle: "CTO",
        industry: "Fintech",
        companySize: "100-500 employees",
        linkedinUrl: "https://linkedin.com/in/michael-chen",
        status: "connected",
        lastContactedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        responseReceived: true,
        meetingScheduled: true,
        enrichmentData: { companyRevenue: "$10M-$50M", technologies: ["React", "Node.js"] },
        createdAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        campaignId: 3,
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily@healthtech.com",
        phone: "(555) 345-6789",
        company: "HealthTech Solutions",
        jobTitle: "VP Operations",
        industry: "Healthcare",
        companySize: "200-500 employees",
        linkedinUrl: "https://linkedin.com/in/emily-rodriguez",
        status: "warm",
        lastContactedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        responseReceived: false,
        meetingScheduled: false,
        enrichmentData: { companyRevenue: "$20M-$50M", technologies: ["Epic", "Cerner"] },
        createdAt: new Date(),
      },
      {
        id: 4,
        userId: 1,
        campaignId: 2,
        firstName: "David",
        lastName: "Kim",
        email: "david@financeflow.com",
        phone: "(555) 456-7890",
        company: "FinanceFlow Corp",
        jobTitle: "CFO",
        industry: "Financial Services",
        companySize: "1000+ employees",
        linkedinUrl: "https://linkedin.com/in/david-kim",
        status: "cold",
        lastContactedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        responseReceived: false,
        meetingScheduled: false,
        enrichmentData: { companyRevenue: "$100M+", technologies: ["SAP", "Oracle"] },
        createdAt: new Date(),
      }
    ];

    contacts.forEach(contact => {
      this.contacts.set(contact.id, contact as Contact);
    });
    this.currentContactId = 5;
  }

  private initializeDemoActivities() {
    const activities = [
      {
        id: 1,
        userId: 1,
        campaignId: 1,
        contactId: 1,
        type: "response_received",
        description: "Sarah Johnson from TechCorp replied to 'Enterprise Security Solutions' campaign",
        metadata: { subject: "Re: Quick question about TechCorp's security strategy" },
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        id: 2,
        userId: 1,
        campaignId: 2,
        contactId: null,
        type: "sequence_sent",
        description: "Follow-up #2 sent to 47 prospects in 'Financial Services Outreach'",
        metadata: { count: 47, sequenceStep: 2 },
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        id: 3,
        userId: 1,
        campaignId: 2,
        contactId: 2,
        type: "meeting_scheduled",
        description: "Demo call booked with Michael Chen from DataFlow Inc.",
        metadata: { meetingTime: "2024-01-15T10:00:00Z" },
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: 4,
        userId: 1,
        campaignId: 3,
        contactId: null,
        type: "ai_optimization",
        description: "Email copy for 'Healthcare Innovation' updated based on performance data",
        metadata: { optimization: "subject_line", improvement: "31% higher open rate" },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      }
    ];

    activities.forEach(activity => {
      this.activities.set(activity.id, activity as Activity);
    });
    this.currentActivityId = 5;
  }

  private initializeDemoIntegrations() {
    const integrations = [
      {
        id: 1,
        userId: 1,
        type: "linkedin",
        isConnected: true,
        credentials: { accessToken: "demo_token" },
        settings: { dailyLimit: 50, connectionMessage: "Hi {{firstName}}, I'd love to connect!" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        type: "email",
        isConnected: true,
        credentials: { email: "alex@company.com", provider: "gmail" },
        settings: { signature: "Best regards,\nAlex Johnson" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        type: "crm",
        isConnected: false,
        credentials: {},
        settings: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    integrations.forEach(integration => {
      this.integrations.set(integration.id, integration as Integration);
    });
    this.currentIntegrationId = 4;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Company operations
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getCompanyByUserId(userId: number): Promise<Company | undefined> {
    return Array.from(this.companies.values()).find(company => company.userId === userId);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const company: Company = { ...insertCompany, id, createdAt: new Date() };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: number, updateCompany: Partial<InsertCompany>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    
    const updatedCompany = { ...company, ...updateCompany };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getCampaignsByUserId(userId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(campaign => campaign.userId === userId);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const campaign: Campaign = { 
      ...insertCampaign, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updateCampaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updateCampaign, updatedAt: new Date() };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  // Contact operations
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContactsByUserId(userId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.userId === userId);
  }

  async getContactsByCampaignId(campaignId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.campaignId === campaignId);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { ...insertContact, id, createdAt: new Date() };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: number, updateContact: Partial<InsertContact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact = { ...contact, ...updateContact };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = { ...insertActivity, id, createdAt: new Date() };
    this.activities.set(id, activity);
    return activity;
  }

  // Integration operations
  async getIntegration(id: number): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async getIntegrationsByUserId(userId: number): Promise<Integration[]> {
    return Array.from(this.integrations.values()).filter(integration => integration.userId === userId);
  }

  async getIntegrationByType(userId: number, type: string): Promise<Integration | undefined> {
    return Array.from(this.integrations.values())
      .find(integration => integration.userId === userId && integration.type === type);
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = this.currentIntegrationId++;
    const integration: Integration = { 
      ...insertIntegration, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: number, updateIntegration: Partial<InsertIntegration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    
    const updatedIntegration = { ...integration, ...updateIntegration, updatedAt: new Date() };
    this.integrations.set(id, updatedIntegration);
    return updatedIntegration;
  }
}

export const storage = new MemStorage();
