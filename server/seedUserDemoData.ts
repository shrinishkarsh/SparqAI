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

    // Create successful campaigns (7+ active campaigns)
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
          sent: 2847,
          opened: 2423,  // 85% open rate
          clicked: 2181,  // 90% click rate
          replied: 114,  // 4% response rate
          meetings: 87,
          deals: 23,
          revenue: 689700
        },
        channels: ["email", "linkedin"],
        strategy: "Multi-touch personalized outreach with case studies",
        totalContacts: 2847,
        sentMessages: 2847,
        responses: 114,
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
          opened: 2732,  // 85% open rate
          clicked: 2895,  // 90% click rate
          replied: 115,  // 3.6% response rate
          meetings: 156,
          deals: 41,
          revenue: 409590
        },
        channels: ["email"],
        strategy: "Trigger-based outreach on funding events",
        totalContacts: 3214,
        sentMessages: 3214,
        responses: 115,
        meetings: 156
      },
      {
        userId,
        companyId: company.id,
        productId: createdProducts[2].id,
        name: "Developer Community API Launch",
        description: "Promoting AI Insights API to developer communities",
        status: "active",
        targetAudience: "CTOs and Engineering Leads at data-driven startups",
        messageTemplate: "Hi {{firstName}}, saw your team's work on {{recent_project}}. Our AI Insights API could help you ship analytics features 10x faster...",
        sequences: [
          { step: 1, type: "email", subject: "Free API credits for {{company}}", delay: 0 },
          { step: 2, type: "email", subject: "Quick API demo for {{firstName}}?", delay: 4 }
        ],
        stats: {
          sent: 1521,
          opened: 1293,  // 85% open rate
          clicked: 1369,  // 90% click rate
          replied: 61,   // 4% response rate
          meetings: 234,
          deals: 89,
          revenue: 267800
        },
        channels: ["email"],
        strategy: "Developer-focused with free credits offer",
        totalContacts: 1521,
        sentMessages: 1521,
        responses: 61,
        meetings: 234
      },
      {
        userId,
        companyId: company.id,
        productId: createdProducts[0].id,
        name: "Financial Services Digital Transformation",
        description: "Targeting banks and insurance companies for analytics modernization",
        status: "active",
        targetAudience: "Chief Digital Officers at financial institutions",
        messageTemplate: "Hi {{firstName}}, I see {{company}} is investing in digital transformation. Our analytics platform is SOC 2 certified and trusted by 15 major banks...",
        sequences: [
          { step: 1, type: "email", subject: "Banking analytics transformation insights", delay: 0 },
          { step: 2, type: "linkedin", message: "Connecting about fintech analytics", delay: 4 },
          { step: 3, type: "email", subject: "Case study: How Bank of America saved $2M", delay: 8 }
        ],
        stats: {
          sent: 1245,
          opened: 1058,  // 85% open rate
          clicked: 1121,  // 90% click rate
          replied: 44,   // 3.5% response rate
          meetings: 67,
          deals: 18,
          revenue: 539820
        },
        channels: ["email", "linkedin"],
        strategy: "Compliance-focused messaging with ROI data",
        totalContacts: 1245,
        sentMessages: 1245,
        responses: 44,
        meetings: 67
      },
      {
        userId,
        companyId: company.id,
        productId: createdProducts[1].id,
        name: "E-commerce Analytics Acceleration",
        description: "Helping online retailers optimize with data insights",
        status: "active",
        targetAudience: "CMOs and Growth Leaders at D2C brands",
        messageTemplate: "Hey {{firstName}}, noticed {{company}}'s impressive growth! Our platform helps e-commerce brands increase conversion rates by 35% on average...",
        sequences: [
          { step: 1, type: "email", subject: "35% conversion lift for {{company}}?", delay: 0 },
          { step: 2, type: "email", subject: "Quick question about your analytics stack", delay: 3 }
        ],
        stats: {
          sent: 856,
          opened: 728,   // 85% open rate
          clicked: 770,   // 90% click rate
          replied: 34,   // 4% response rate
          meetings: 89,
          deals: 28,
          revenue: 279720
        },
        channels: ["email"],
        strategy: "Conversion-focused with specific metrics",
        totalContacts: 856,
        sentMessages: 856,
        responses: 34,
        meetings: 89
      },
      {
        userId,
        companyId: company.id,
        productId: createdProducts[0].id,
        name: "Healthcare Provider Data Initiative",
        description: "Empowering healthcare organizations with predictive analytics",
        status: "active",
        targetAudience: "VPs of Innovation at hospital systems",
        messageTemplate: "Hi {{firstName}}, healthcare data is complex. Our HIPAA-compliant platform helps providers like {{company}} improve patient outcomes while reducing costs...",
        sequences: [
          { step: 1, type: "email", subject: "Improving patient outcomes at {{company}}", delay: 0 },
          { step: 2, type: "linkedin", message: "Healthcare analytics innovation", delay: 5 },
          { step: 3, type: "email", subject: "Mayo Clinic case study", delay: 10 }
        ],
        stats: {
          sent: 432,
          opened: 367,   // 85% open rate
          clicked: 389,   // 90% click rate
          replied: 15,   // 3.5% response rate
          meetings: 45,
          deals: 12,
          revenue: 359880
        },
        channels: ["email", "linkedin"],
        strategy: "HIPAA compliance and patient outcome focus",
        totalContacts: 432,
        sentMessages: 432,
        responses: 15,
        meetings: 45
      },
      {
        userId,
        companyId: company.id,
        productId: createdProducts[2].id,
        name: "AI Startup Accelerator Program",
        description: "Supporting AI startups with free API credits and mentorship",
        status: "active",
        targetAudience: "Founders of AI/ML startups",
        messageTemplate: "Hi {{firstName}}, impressive work on {{company}}! We're offering select AI startups $10K in free API credits plus technical mentorship...",
        sequences: [
          { step: 1, type: "email", subject: "$10K free credits for {{company}}", delay: 0 },
          { step: 2, type: "email", subject: "AI startup accelerator invitation", delay: 2 }
        ],
        stats: {
          sent: 287,
          opened: 244,   // 85% open rate
          clicked: 258,   // 90% click rate
          replied: 11,   // 3.8% response rate
          meetings: 78,
          deals: 34,
          revenue: 102360
        },
        channels: ["email"],
        strategy: "Value-first with free credits offer",
        totalContacts: 287,
        sentMessages: 287,
        responses: 11,
        meetings: 78
      }
    ];

    const createdCampaigns = [];
    for (const campaign of campaigns) {
      const created = await storage.createCampaign(campaign);
      createdCampaigns.push(created);
    }

    // Create high-quality contacts (sample of hot, warm, and cold leads)
    // Note: Creating 50 sample contacts to represent the 10,000+ database
    const leadStatuses = ["hot", "warm", "cold"];
    const industries = ["Technology", "Finance", "Healthcare", "E-commerce", "SaaS", "Manufacturing", "Retail"];
    const jobTitles = ["VP of Operations", "Chief Data Officer", "CTO", "VP of Engineering", "Director of Analytics", "Head of Innovation", "VP of Growth"];
    const companySizes = ["10-50", "50-200", "200-500", "500-1000", "1000-5000", "5000-10000", "10000+"];
    
    // Create specific high-value contacts first
    const highValueContacts = [
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
      }
    ];

    for (const contact of highValueContacts) {
      await storage.createContact(contact);
    }

    // Generate additional contacts to represent the larger database
    const firstNames = ["James", "Emma", "Robert", "Olivia", "William", "Sophia", "Benjamin", "Isabella", "Lucas", "Mia"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Wilson"];
    
    // Create 47 regular contacts with proper status distribution
    for (let i = 0; i < 47; i++) {
      const campaignIndex = i % createdCampaigns.length;
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      
      // Assign status to ensure we have 15 hot, 15 warm, 17 cold
      let status;
      if (i < 15) status = "hot";
      else if (i < 30) status = "warm";
      else status = "cold";
      
      const contact = {
        userId,
        campaignId: createdCampaigns[campaignIndex].id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${lastName.toLowerCase()}corp.com`,
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-555-${String(i + 1000).padStart(4, '0')}`,
        company: `${lastName} ${industries[i % industries.length]} Corp`,
        jobTitle: jobTitles[i % jobTitles.length],
        industry: industries[i % industries.length],
        companySize: companySizes[i % companySizes.length],
        linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`,
        status,
        lastContactedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        responseReceived: status === "hot" || (status === "warm" && i % 2 === 0),
        meetingScheduled: status === "hot" && i % 3 === 0,
        enrichmentData: status !== "cold" ? {
          companyRevenue: `$${Math.floor(Math.random() * 900 + 100)}M`,
          recentNews: "Recent expansion announcement",
          painPoints: ["Scalability", "Data integration"],
          budget: status === "hot" ? "$100K-500K" : "$50K-100K"
        } : undefined
      };
      
      await storage.createContact(contact);
    }

    // Create 18 additional "connected" status contacts for a total of 68 connections
    for (let i = 0; i < 18; i++) {
      const campaignIndex = i % createdCampaigns.length;
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[(i + 5) % lastNames.length];
      
      const contact = {
        userId,
        campaignId: createdCampaigns[campaignIndex].id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.connected${i}@${lastName.toLowerCase()}corp.com`,
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-555-${String(i + 2000).padStart(4, '0')}`,
        company: `${lastName} ${industries[i % industries.length]} Partners`,
        jobTitle: jobTitles[i % jobTitles.length],
        industry: industries[i % industries.length],
        companySize: companySizes[i % companySizes.length],
        linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}connected${i}`,
        status: "connected",
        lastContactedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        responseReceived: true,
        meetingScheduled: true,
        enrichmentData: {
          companyRevenue: `$${Math.floor(Math.random() * 900 + 100)}M`,
          recentNews: "Became a client last month",
          painPoints: ["Solved with our solution"],
          budget: "Active customer - $200K ARR"
        }
      };
      
      await storage.createContact(contact);
    }

    console.log("Created 68 sample contacts representing 10,000+ lead database with 68 connections");

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