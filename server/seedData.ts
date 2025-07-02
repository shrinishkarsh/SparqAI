import { db } from "./db";
import { users, companies, campaigns, contacts, activities, integrations } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log('Seeding database with demo data...');

    // Create demo user
    const [demoUser] = await db.insert(users).values({
      email: "alex@company.com",
      username: "alex_johnson",
      password: "hashed_password_123",
      firstName: "Alex",
      lastName: "Johnson",
      company: "SparqAI",
      website: "https://sparqai.com",
      isSetupComplete: true
    }).returning();

    // Create demo company
    const [demoCompany] = await db.insert(companies).values({
      name: "SparqAI",
      userId: demoUser.id,
      size: "11-50",
      description: "AI-powered sales development platform that automates lead generation, enrichment, and outreach campaigns.",
      industry: "Software",
      website: "https://sparqai.com",
      targetIcp: "VP of Sales at SaaS companies with 50-200 employees, $10M+ ARR, based in North America"
    }).returning();

    // Create demo campaigns
    const demoCampaigns = await db.insert(campaigns).values([
      {
        name: "Q1 2025 Enterprise Outreach",
        userId: demoUser.id,
        companyId: demoCompany.id,
        status: "active",
        description: "Targeting enterprise SaaS companies for our AI SDR solution",
        targetAudience: "VP of Sales at enterprise SaaS companies",
        messageTemplate: "Hi {{firstName}}, I noticed {{company}} has been scaling rapidly...",
        sequences: {
          email: { steps: 3, delay: 3 },
          linkedin: { steps: 2, delay: 2 }
        },
        stats: {
          sent: 245,
          opened: 98,
          replied: 23,
          meetings: 8,
          responseRate: 9.4
        }
      },
      {
        name: "SaaS Startup Outreach",
        userId: demoUser.id,
        companyId: demoCompany.id,
        status: "paused",
        description: "Focused on early-stage SaaS startups",
        targetAudience: "Founders and sales leaders at SaaS startups",
        messageTemplate: "Hi {{firstName}}, Love what you're building at {{company}}...",
        sequences: {
          email: { steps: 2, delay: 5 },
          linkedin: { steps: 1, delay: 3 }
        },
        stats: {
          sent: 89,
          opened: 34,
          replied: 7,
          meetings: 2,
          responseRate: 7.9
        }
      }
    ]).returning();

    // Create demo contacts
    await db.insert(contacts).values([
      {
        firstName: "Sarah",
        lastName: "Chen",
        email: "sarah.chen@techcorp.com",
        company: "TechCorp",
        jobTitle: "VP of Sales",
        status: "hot",
        userId: demoUser.id,
        campaignId: demoCampaigns[0].id,
        phone: "+1 (555) 123-4567",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        companySize: "201-500",
        industry: "Software",
        notes: "Very interested in AI automation. Scheduled demo for next week.",
        enrichmentData: {
          company: "TechCorp",
          industry: "Software",
          companySize: "201-500",
          revenue: "$50M-100M",
          technologies: ["Salesforce", "HubSpot", "Slack"]
        }
      },
      {
        firstName: "Michael",
        lastName: "Rodriguez",
        email: "m.rodriguez@innovateai.com",
        company: "InnovateAI",
        jobTitle: "Head of Business Development",
        status: "warm",
        userId: demoUser.id,
        campaignId: demoCampaigns[0].id,
        phone: "+1 (555) 987-6543",
        linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
        companySize: "51-200",
        industry: "Artificial Intelligence",
        notes: "Responded to initial email. Needs more information about pricing.",
        enrichmentData: {
          company: "InnovateAI",
          industry: "Artificial Intelligence",
          companySize: "51-200",
          revenue: "$10M-50M",
          technologies: ["Python", "TensorFlow", "AWS"]
        }
      },
      {
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@growthco.io",
        company: "GrowthCo",
        jobTitle: "Director of Sales Operations",
        status: "cold",
        userId: demoUser.id,
        campaignId: demoCampaigns[1].id,
        phone: "+1 (555) 456-7890",
        linkedinUrl: "https://linkedin.com/in/emilydavis",
        companySize: "11-50",
        industry: "Marketing Technology",
        notes: "Initial outreach sent. No response yet.",
        enrichmentData: {
          company: "GrowthCo",
          industry: "Marketing Technology",
          companySize: "11-50",
          revenue: "$1M-10M",
          technologies: ["HubSpot", "Mailchimp", "Google Analytics"]
        }
      },
      {
        firstName: "David",
        lastName: "Kim",
        email: "david.kim@scalestartup.com",
        company: "ScaleStartup",
        jobTitle: "Co-founder & CEO",
        status: "connected",
        userId: demoUser.id,
        campaignId: demoCampaigns[1].id,
        phone: "+1 (555) 321-0987",
        linkedinUrl: "https://linkedin.com/in/davidkim",
        companySize: "1-10",
        industry: "SaaS",
        notes: "Connected on LinkedIn. Very interested in our solution.",
        enrichmentData: {
          company: "ScaleStartup",
          industry: "SaaS",
          companySize: "1-10",
          revenue: "$1M-10M",
          technologies: ["Stripe", "React", "Node.js"]
        }
      }
    ]);

    // Create demo activities
    await db.insert(activities).values([
      {
        type: "email_sent",
        description: "Email sent to Sarah Chen",
        userId: demoUser.id,
        campaignId: demoCampaigns[0].id,
        metadata: { email: "sarah.chen@techcorp.com", subject: "Quick question about TechCorp's growth plans" }
      },
      {
        type: "campaign_created",
        description: "Created new campaign: Q1 2025 Enterprise Outreach",
        userId: demoUser.id,
        campaignId: demoCampaigns[0].id,
        metadata: { campaignName: "Q1 2025 Enterprise Outreach" }
      },
      {
        type: "contact_replied",
        description: "Michael Rodriguez replied to outreach email",
        userId: demoUser.id,
        campaignId: demoCampaigns[0].id,
        metadata: { email: "m.rodriguez@innovateai.com", sentiment: "positive" }
      },
      {
        type: "meeting_scheduled",
        description: "Demo scheduled with Sarah Chen",
        userId: demoUser.id,
        campaignId: demoCampaigns[0].id,
        metadata: { meetingDate: "2025-01-10", platform: "Zoom" }
      }
    ]);

    // Create demo integrations
    await db.insert(integrations).values([
      {
        type: "linkedin",
        userId: demoUser.id,
        isConnected: true,
        credentials: { email: "alex@company.com", token: "encrypted_token" },
        settings: { autoConnect: true, dailyLimit: 50, connectionMessage: "Hi {{firstName}}, I'd love to connect!" }
      },
      {
        type: "email",
        userId: demoUser.id,
        isConnected: true,
        credentials: { smtpServer: "smtp.gmail.com", port: 587, username: "alex@company.com" },
        settings: { useTLS: true, dailyLimit: 100 }
      },
      {
        type: "crm",
        userId: demoUser.id,
        isConnected: false,
        credentials: {},
        settings: { autoSync: true, defaultStage: "New Lead" }
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}