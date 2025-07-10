import { storage } from "./storage";
import type { User } from "@shared/schema";

export async function seedUserDemoData(userId: string) {
  try {
    console.log("Seeding demo data for user:", userId);

    // Create company
    const company = await storage.createCompany({
      userId,
      name: "TechVision Solutions",
      website: "https://techvision.com",
      description: "Leading provider of AI-powered business intelligence solutions",
      industry: "Software & Technology",
      size: "50-200 employees",
      targetIcp: "Enterprise B2B SaaS companies",
      targetMarket: "North American enterprises with 500+ employees",
      valueProposition: "Reduce operational costs by 40% with our AI-driven analytics platform",
      idealCustomerProfile: "VP of Operations at Fortune 500 companies experiencing data silos",
      companyGoals: "Expand market share by 200% in enterprise segment",
      salesProcess: "Consultative selling with POC-driven approach",
      competitiveAdvantage: "Only platform with real-time predictive analytics and 99.9% uptime",
      revenueModel: "Annual subscription with usage-based pricing",
      geographicFocus: "USA, Canada, UK",
      preferredChannels: ["email", "linkedin", "webinars"]
    });

    // Create products
    const products = [
      {
        userId,
        companyId: company.id,
        name: "Enterprise Analytics Suite",
        description: "Complete business intelligence platform with AI-powered insights",
        category: "Business Intelligence",
        price: "$2,999/month",
        features: ["Real-time dashboards", "Predictive analytics", "Custom reporting", "API access", "White-label options"],
        targetAudience: "Enterprise companies with complex data needs",
        useCases: "Executive reporting, operational efficiency, revenue forecasting",
        monthlyRevenue: 149950,
        customerCount: 52,
        churnRate: 2.1,
        benefits: ["40% faster decision making", "60% reduction in report generation time"],
        competitiveAdvantage: "Only solution with real-time ML predictions",
        salesPoints: ["ROI within 3 months", "24/7 dedicated support", "SOC 2 certified"],
        isActive: true
      },
      {
        userId,
        companyId: company.id,
        name: "Growth Analytics Pro",
        description: "Mid-market solution for growing companies",
        category: "Analytics",
        price: "$999/month",
        features: ["Automated reporting", "Growth metrics", "Team collaboration", "Mobile app"],
        targetAudience: "Fast-growing SaaS companies",
        useCases: "Growth tracking, investor reporting, team performance",
        monthlyRevenue: 89910,
        customerCount: 93,
        churnRate: 3.5,
        benefits: ["2x faster growth identification", "Automated investor updates"],
        competitiveAdvantage: "Built specifically for high-growth companies",
        salesPoints: ["14-day free trial", "No setup fees", "Unlimited users"],
        isActive: true
      },
      {
        userId,
        companyId: company.id,
        name: "AI Insights API",
        description: "Developer-friendly API for custom integrations",
        category: "API/Developer Tools",
        price: "$0.10/request",
        features: ["REST & GraphQL", "99.9% uptime SLA", "Real-time webhooks", "SDKs for 8 languages"],
        targetAudience: "Tech companies building data products",
        useCases: "Embed analytics, build custom dashboards, data enrichment",
        monthlyRevenue: 67420,
        customerCount: 234,
        churnRate: 1.8,
        benefits: ["Ship analytics features 10x faster", "Enterprise-grade reliability"],
        competitiveAdvantage: "Most comprehensive data models in the industry",
        salesPoints: ["Pay as you go", "First 10k requests free", "Developer sandbox"],
        isActive: true
      }
    ];

    const createdProducts = [];
    for (const product of products) {
      const created = await storage.createProduct(product);
      createdProducts.push(created);
    }

    // Create successful campaigns
    const campaigns = [
      {
        userId,
        companyId: company.id,
        productId: createdProducts[0].id,
        name: "Q1 Enterprise Expansion Campaign",
        description: "Targeting Fortune 500 companies for Enterprise Analytics Suite",
        status: "active",
        targetAudience: "VPs and C-suite at Fortune 500 companies",
        messageTemplate: "Hi {{firstName}}, I noticed {{company}} is growing rapidly. Our Enterprise Analytics Suite has helped similar companies reduce decision-making time by 40%...",
        sequences: [
          { step: 1, type: "email", subject: "Quick question about {{company}}'s analytics", delay: 0 },
          { step: 2, type: "linkedin", message: "Following up on my email...", delay: 3 },
          { step: 3, type: "email", subject: "{{company}} + TechVision case study", delay: 7 }
        ],
        stats: {
          sent: 1847,
          opened: 1423,
          clicked: 892,
          replied: 246,
          meetings: 87,
          deals: 23,
          revenue: 689700
        },
        channels: ["email", "linkedin"],
        strategy: "Multi-touch personalized outreach with case studies",
        totalContacts: 2000,
        sentMessages: 1847,
        responses: 246,
        meetings: 87
      },
      {
        userId,
        companyId: company.id,
        productId: createdProducts[1].id,
        name: "SaaS Growth Leaders Outreach",
        description: "Targeting high-growth SaaS companies for Growth Analytics Pro",
        status: "active",
        targetAudience: "Founders and Growth VPs at Series A/B SaaS companies",
        messageTemplate: "Hey {{firstName}}, congrats on the recent funding! I work with fast-growing SaaS companies like {{company}} to accelerate their growth metrics...",
        sequences: [
          { step: 1, type: "email", subject: "Congrats on the funding round!", delay: 0 },
          { step: 2, type: "email", subject: "How {{company}} can 2x growth velocity", delay: 5 }
        ],
        stats: {
          sent: 3214,
          opened: 2571,
          clicked: 1543,
          replied: 428,
          meetings: 156,
          deals: 41,
          revenue: 409590
        },
        channels: ["email"],
        strategy: "Trigger-based outreach on funding events",
        totalContacts: 3500,
        sentMessages: 3214,
        responses: 428,
        meetings: 156
      },
      {
        userId,
        companyId: company.id,
        productId: createdProducts[2].id,
        name: "Developer Community API Launch",
        description: "Promoting AI Insights API to developer communities",
        status: "completed",
        targetAudience: "CTOs and Engineering Leads at data-driven startups",
        messageTemplate: "Hi {{firstName}}, saw your team's work on {{recent_project}}. Our AI Insights API could help you ship analytics features 10x faster...",
        sequences: [
          { step: 1, type: "email", subject: "Free API credits for {{company}}", delay: 0 },
          { step: 2, type: "email", subject: "Quick API demo for {{firstName}}?", delay: 4 }
        ],
        stats: {
          sent: 4521,
          opened: 3617,
          clicked: 2169,
          replied: 687,
          meetings: 234,
          deals: 89,
          revenue: 267800
        },
        channels: ["email"],
        strategy: "Developer-focused with free credits offer",
        totalContacts: 5000,
        sentMessages: 4521,
        responses: 687,
        meetings: 234
      }
    ];

    const createdCampaigns = [];
    for (const campaign of campaigns) {
      const created = await storage.createCampaign(campaign);
      createdCampaigns.push(created);
    }

    // Create high-quality contacts
    const contacts = [
      {
        userId,
        campaignId: createdCampaigns[0].id,
        firstName: "Michael",
        lastName: "Chen",
        email: "m.chen@fortune500tech.com",
        phone: "+1-415-555-0100",
        company: "Fortune500Tech Corp",
        jobTitle: "VP of Operations",
        industry: "Technology",
        companySize: "10,000+",
        linkedinUrl: "https://linkedin.com/in/michaelchen",
        status: "hot",
        lastContactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        responseReceived: true,
        meetingScheduled: true,
        enrichmentData: {
          companyRevenue: "$2.3B",
          recentNews: "Announced $500M AI initiative",
          painPoints: ["Data silos", "Slow reporting"],
          budget: "$500K-1M"
        }
      },
      {
        userId,
        campaignId: createdCampaigns[0].id,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sjohnson@megacorp.com",
        phone: "+1-212-555-0200",
        company: "MegaCorp Industries",
        jobTitle: "Chief Data Officer",
        industry: "Finance",
        companySize: "50,000+",
        linkedinUrl: "https://linkedin.com/in/sarahjohnson",
        status: "warm",
        lastContactedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        responseReceived: true,
        meetingScheduled: false,
        enrichmentData: {
          companyRevenue: "$8.7B",
          recentNews: "Digital transformation focus",
          painPoints: ["Legacy systems", "Real-time analytics"],
          budget: "$1M+"
        }
      },
      {
        userId,
        campaignId: createdCampaigns[1].id,
        firstName: "David",
        lastName: "Park",
        email: "david@rocketstartup.io",
        phone: "+1-650-555-0300",
        company: "RocketStartup",
        jobTitle: "Founder & CEO",
        industry: "SaaS",
        companySize: "50-200",
        linkedinUrl: "https://linkedin.com/in/davidpark",
        status: "hot",
        lastContactedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        responseReceived: true,
        meetingScheduled: true,
        enrichmentData: {
          fundingStage: "Series B - $45M",
          growthRate: "300% YoY",
          currentTools: ["Mixpanel", "Amplitude"],
          decisionTimeframe: "This quarter"
        }
      },
      {
        userId,
        campaignId: createdCampaigns[1].id,
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.r@hypergrowth.com",
        phone: "+1-408-555-0400",
        company: "HyperGrowth Inc",
        jobTitle: "VP of Growth",
        industry: "E-commerce",
        companySize: "200-500",
        linkedinUrl: "https://linkedin.com/in/emilyrodriguez",
        status: "warm",
        lastContactedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        responseReceived: true,
        meetingScheduled: false,
        enrichmentData: {
          fundingStage: "Series A - $25M",
          monthlyGrowth: "25%",
          challenges: ["Attribution", "CAC optimization"],
          timeline: "Evaluating solutions"
        }
      },
      {
        userId,
        campaignId: createdCampaigns[2].id,
        firstName: "Alex",
        lastName: "Thompson",
        email: "alex.t@devtools.co",
        phone: "+1-206-555-0500",
        company: "DevTools Co",
        jobTitle: "CTO",
        industry: "Developer Tools",
        companySize: "10-50",
        linkedinUrl: "https://linkedin.com/in/alexthompson",
        status: "hot",
        lastContactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        responseReceived: true,
        meetingScheduled: true,
        enrichmentData: {
          techStack: ["React", "Node.js", "PostgreSQL"],
          apiNeeds: "Real-time analytics for user dashboard",
          teamSize: "12 engineers",
          budget: "$50K/year"
        }
      }
    ];

    for (const contact of contacts) {
      await storage.createContact(contact);
    }

    // Create recent activities
    const activities = [
      {
        userId,
        campaignId: createdCampaigns[0].id,
        contactId: null,
        type: "campaign_launched",
        description: "Launched Q1 Enterprise Expansion Campaign",
        metadata: { contactsAdded: 2000, emailsScheduled: 2000 }
      },
      {
        userId,
        campaignId: createdCampaigns[0].id,
        contactId: 1,
        type: "meeting_scheduled",
        description: "Meeting scheduled with Michael Chen from Fortune500Tech Corp",
        metadata: { date: "2025-01-15", value: "$500K opportunity" }
      },
      {
        userId,
        campaignId: createdCampaigns[1].id,
        contactId: 3,
        type: "response_received",
        description: "David Park responded positively to outreach",
        metadata: { sentiment: "positive", intent: "high" }
      },
      {
        userId,
        campaignId: createdCampaigns[0].id,
        contactId: null,
        type: "milestone_reached",
        description: "Campaign hit 20% response rate milestone!",
        metadata: { responses: 246, meetings: 87 }
      },
      {
        userId,
        campaignId: createdCampaigns[2].id,
        contactId: 5,
        type: "deal_closed",
        description: "Closed deal with DevTools Co - $50K ARR",
        metadata: { dealSize: "$50,000", product: "AI Insights API" }
      }
    ];

    for (const activity of activities) {
      await storage.createActivity(activity);
    }

    // Create integrations (connected state)
    const integrations = [
      {
        userId,
        type: "linkedin",
        name: "LinkedIn Sales Navigator",
        credentials: { connected: true },
        settings: { autoSync: true, syncFrequency: "daily" },
        isActive: true,
        lastSyncedAt: new Date()
      },
      {
        userId,
        type: "email",
        name: "Google Workspace",
        credentials: { connected: true },
        settings: { trackingEnabled: true, signatureAdded: true },
        isActive: true,
        lastSyncedAt: new Date()
      },
      {
        userId,
        type: "crm",
        name: "Salesforce",
        credentials: { connected: true },
        settings: { autoLogActivities: true, syncContacts: true },
        isActive: true,
        lastSyncedAt: new Date()
      }
    ];

    for (const integration of integrations) {
      await storage.createIntegration(integration);
    }

    console.log("Demo data seeded successfully for user:", userId);
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}