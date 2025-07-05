import { db } from "./db";
import { users, companies, campaigns, contacts, activities, integrations, products } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log('Seeding database with comprehensive demo data...');

    // Clear existing data first
    await db.delete(activities);
    await db.delete(contacts);
    await db.delete(campaigns);
    await db.delete(products);
    await db.delete(integrations);
    await db.delete(companies);
    await db.delete(users);

    // Create demo user
    const [demoUser] = await db.insert(users).values({
      id: "1", // String ID for Replit Auth compatibility
      email: "alex@sparqai.com",
      firstName: "Alex",
      lastName: "Johnson",
      company: "SparqAI",
      website: "https://sparqai.com",
      isSetupComplete: true
    }).returning();

    // Create demo company
    const [demoCompany] = await db.insert(companies).values({
      name: "SparqAI Technologies",
      userId: 1,
      size: "51-100",
      description: "AI-powered sales development platform that automates lead generation, enrichment, and multi-channel outreach campaigns for B2B companies.",
      industry: "Software",
      website: "https://sparqai.com",
      targetIcp: "VP of Sales, Sales Directors, and RevOps leaders at SaaS companies with 50-500 employees, $5M-$100M ARR, based in North America and Europe",
      geographicFocus: "North America, Europe",
      revenueRange: "$10M-$50M",
      teamSize: "75 employees",
      foundedYear: "2022",
      businessModel: "B2B SaaS",
      keyProducts: "AI SDR Platform, Lead Enrichment API, Sales Analytics Dashboard"
    }).returning();

    // Create comprehensive products
    const demoProducts = await db.insert(products).values([
      {
        name: "SparqAI SDR Platform",
        userId: 1,
        companyId: demoCompany.id,
        description: "AI-powered sales development representative that automates prospecting, outreach, and lead qualification",
        competitiveAdvantage: "Advanced GPT-4 integration with 95% personalization accuracy and multi-channel automation",
        targetMarket: "B2B SaaS companies with inside sales teams",
        pricing: "$299/month per seat",
        stage: "growth",
        launchDate: new Date('2023-06-01'),
        features: ["AI Prospecting", "Multi-channel Outreach", "Lead Scoring", "CRM Integration"],
        metrics: { mrr: 45000, customers: 150, churnRate: 2.5 },
        isActive: true
      },
      {
        name: "Lead Enrichment API",
        userId: 1,
        companyId: demoCompany.id,
        description: "Real-time contact and company data enrichment service with 99.5% accuracy",
        competitiveAdvantage: "Proprietary data sources with real-time verification and GDPR compliance",
        targetMarket: "Sales teams, Marketing automation platforms, CRM providers",
        pricing: "$0.05 per enrichment",
        stage: "mature",
        launchDate: new Date('2023-03-15'),
        features: ["Contact Discovery", "Company Intelligence", "Technographics", "Intent Data"],
        metrics: { mrr: 28000, customers: 320, churnRate: 1.8 },
        isActive: true
      },
      {
        name: "Sales Analytics Dashboard",
        userId: 1,
        companyId: demoCompany.id,
        description: "Advanced analytics and reporting platform for sales performance optimization",
        competitiveAdvantage: "AI-powered insights with predictive analytics and custom dashboards",
        targetMarket: "Sales Operations teams and Revenue Leaders",
        pricing: "$199/month per team",
        stage: "growth",
        launchDate: new Date('2023-09-01'),
        features: ["Performance Analytics", "Predictive Insights", "Custom Dashboards", "ROI Tracking"],
        metrics: { mrr: 18000, customers: 90, churnRate: 3.2 },
        isActive: true
      }
    ]).returning();

    // Create comprehensive campaigns
    const demoCampaigns = await db.insert(campaigns).values([
      {
        name: "Q1 2025 Enterprise SaaS Outreach",
        userId: 1,
        companyId: demoCompany.id,
        status: "active",
        description: "Targeting VP of Sales at enterprise SaaS companies with 100-1000 employees for our AI SDR platform",
        targetAudience: "VP of Sales, Sales Directors at enterprise SaaS companies ($10M-$100M ARR)",
        messageTemplate: "Hi {{firstName}}, I noticed {{company}} has been scaling rapidly in the {{industry}} space. Many sales leaders like yourself are finding it challenging to maintain personalized outreach at scale while hitting aggressive growth targets...",
        sequences: {
          email: { steps: 5, delay: 3 },
          linkedin: { steps: 3, delay: 2 },
          phone: { steps: 2, delay: 7 }
        },
        stats: {
          sent: 842,
          opened: 387,
          replied: 94,
          meetings: 28,
          responseRate: 11.2,
          meetingRate: 3.3,
          pipelineGenerated: 420000
        },
        smartleadId: 12847,
        isActive: true,
        budget: 15000,
        spent: 8450,
        cpl: 89.36,
        roi: 497.2
      },
      {
        name: "Mid-Market RevOps Leaders Campaign",
        userId: 1,
        companyId: demoCompany.id,
        status: "active",
        description: "Focused outreach to Revenue Operations leaders at mid-market companies seeking sales automation solutions",
        targetAudience: "RevOps Directors, Sales Operations Managers at companies with 50-200 employees",
        messageTemplate: "Hi {{firstName}}, RevOps leaders at companies like {{company}} are achieving 35% faster sales cycles by implementing AI-powered SDR automation...",
        sequences: {
          email: { steps: 4, delay: 4 },
          linkedin: { steps: 2, delay: 3 }
        },
        stats: {
          sent: 623,
          opened: 249,
          replied: 56,
          meetings: 18,
          responseRate: 9.0,
          meetingRate: 2.9,
          pipelineGenerated: 285000
        },
        smartleadId: 12848,
        isActive: true,
        budget: 12000,
        spent: 5630,
        cpl: 98.33,
        roi: 506.1
      },
      {
        name: "European Market Expansion",
        userId: 1,
        companyId: demoCompany.id,
        status: "paused",
        description: "Expanding into European markets targeting UK and German SaaS companies",
        targetAudience: "Sales Directors at UK and German B2B SaaS companies",
        messageTemplate: "Hi {{firstName}}, European SaaS companies like {{company}} are scaling their sales teams 40% faster with AI automation...",
        sequences: {
          email: { steps: 3, delay: 5 },
          linkedin: { steps: 2, delay: 4 }
        },
        stats: {
          sent: 234,
          opened: 89,
          replied: 18,
          meetings: 6,
          responseRate: 7.7,
          meetingRate: 2.6,
          pipelineGenerated: 125000
        },
        smartleadId: 12849,
        isActive: false,
        budget: 8000,
        spent: 2100,
        cpl: 116.67,
        roi: 595.2
      },
      {
        name: "Product Hunt Launch Campaign",
        userId: 1,
        companyId: demoCompany.id,
        status: "completed",
        description: "Outreach campaign for Product Hunt launch targeting early adopters and tech influencers",
        targetAudience: "Startup founders, Product managers, Tech influencers",
        messageTemplate: "Hi {{firstName}}, we're launching our AI SDR platform on Product Hunt next week and would love your support...",
        sequences: {
          email: { steps: 2, delay: 2 },
          linkedin: { steps: 1, delay: 1 }
        },
        stats: {
          sent: 156,
          opened: 98,
          replied: 45,
          meetings: 12,
          responseRate: 28.8,
          meetingRate: 7.7,
          pipelineGenerated: 85000
        },
        smartleadId: 12850,
        isActive: false,
        budget: 3000,
        spent: 2850,
        cpl: 23.75,
        roi: 298.2
      },
      {
        name: "Partner Channel Development",
        userId: 1,
        companyId: demoCompany.id,
        status: "launching",
        description: "Building strategic partnerships with CRM and marketing automation vendors",
        targetAudience: "Partnership Directors, Business Development leaders at SaaS companies",
        messageTemplate: "Hi {{firstName}}, I've been following {{company}}'s impressive growth and think there's a strong partnership opportunity...",
        sequences: {
          email: { steps: 3, delay: 7 },
          linkedin: { steps: 2, delay: 5 }
        },
        stats: {
          sent: 45,
          opened: 28,
          replied: 8,
          meetings: 3,
          responseRate: 17.8,
          meetingRate: 6.7,
          pipelineGenerated: 150000
        },
        smartleadId: 12851,
        isActive: true,
        budget: 5000,
        spent: 750,
        cpl: 83.33,
        roi: 2000.0
      }
    ]).returning();

    // Create comprehensive contacts
    const demoContacts = await db.insert(contacts).values([
      // Enterprise contacts
      {
        email: "sarah.chen@techcorp.com",
        firstName: "Sarah",
        lastName: "Chen",
        userId: 1,
        campaignId: demoCampaigns[0].id,
        company: "TechCorp Solutions",
        jobTitle: "VP of Sales",
        industry: "Software",
        status: "qualified",
        location: "San Francisco, CA",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        phoneNumber: "+1-555-0123",
        leadScore: 92,
        lastContactDate: new Date('2025-01-04'),
        enrichmentData: {
          companySize: "250 employees",
          companyRevenue: "$50M",
          technologies: ["Salesforce", "HubSpot", "Outreach"],
          recentFunding: "$15M Series B",
          recentNews: "Expanded to European markets"
        }
      },
      {
        email: "michael.torres@growthsaas.io",
        firstName: "Michael",
        lastName: "Torres",
        userId: 1,
        campaignId: demoCampaigns[0].id,
        company: "GrowthSaaS",
        jobTitle: "Sales Director",
        industry: "Marketing Technology",
        status: "meeting_scheduled",
        location: "Austin, TX",
        linkedinUrl: "https://linkedin.com/in/michaeltorres",
        phoneNumber: "+1-555-0124",
        leadScore: 87,
        lastContactDate: new Date('2025-01-03'),
        enrichmentData: {
          companySize: "180 employees",
          companyRevenue: "$25M",
          technologies: ["Pipedrive", "Klaviyo", "Intercom"],
          recentFunding: "$8M Series A",
          recentNews: "Launched new AI product suite"
        }
      },
      {
        email: "jennifer.rodriguez@scaleup.com",
        firstName: "Jennifer",
        lastName: "Rodriguez",
        userId: 1,
        campaignId: demoCampaigns[1].id,
        company: "ScaleUp Inc",
        jobTitle: "RevOps Director",
        industry: "Financial Services",
        status: "replied",
        location: "New York, NY",
        linkedinUrl: "https://linkedin.com/in/jenniferrodriguez",
        phoneNumber: "+1-555-0125",
        leadScore: 94,
        lastContactDate: new Date('2025-01-02'),
        enrichmentData: {
          companySize: "120 employees",
          companyRevenue: "$18M",
          technologies: ["Salesforce", "Marketo", "Gong"],
          recentFunding: "Bootstrapped",
          recentNews: "IPO planning announced"
        }
      },
      {
        email: "david.kim@innovatetech.co.uk",
        firstName: "David",
        lastName: "Kim",
        userId: 1,
        campaignId: demoCampaigns[2].id,
        company: "InnovateTech Ltd",
        jobTitle: "Head of Sales",
        industry: "Software",
        status: "contacted",
        location: "London, UK",
        linkedinUrl: "https://linkedin.com/in/davidkim",
        phoneNumber: "+44-20-7946-0958",
        leadScore: 78,
        lastContactDate: new Date('2024-12-20'),
        enrichmentData: {
          companySize: "95 employees",
          companyRevenue: "£12M",
          technologies: ["HubSpot", "Slack", "Zoom"],
          recentFunding: "£5M Series A",
          recentNews: "Opened Berlin office"
        }
      },
      {
        email: "lisa.johnson@startuphub.de",
        firstName: "Lisa",
        lastName: "Johnson",
        userId: 1,
        campaignId: demoCampaigns[2].id,
        company: "StartupHub Berlin",
        jobTitle: "Sales Manager",
        industry: "Consulting",
        status: "bounced",
        location: "Berlin, Germany",
        linkedinUrl: "https://linkedin.com/in/lisajohnson",
        phoneNumber: "+49-30-12345678",
        leadScore: 65,
        lastContactDate: new Date('2024-12-18'),
        enrichmentData: {
          companySize: "45 employees",
          companyRevenue: "€8M",
          technologies: ["Pipedrive", "Slack", "Calendly"],
          recentFunding: "€2M Seed",
          recentNews: "New partnership with SAP"
        }
      },
      // Add more contacts for other campaigns...
      {
        email: "alex.founder@techstartup.com",
        firstName: "Alex",
        lastName: "Founder",
        userId: 1,
        campaignId: demoCampaigns[3].id,
        company: "TechStartup Inc",
        jobTitle: "CEO",
        industry: "Technology",
        status: "meeting_completed",
        location: "Silicon Valley, CA",
        linkedinUrl: "https://linkedin.com/in/alexfounder",
        phoneNumber: "+1-555-0130",
        leadScore: 96,
        lastContactDate: new Date('2024-11-15'),
        enrichmentData: {
          companySize: "25 employees",
          companyRevenue: "$3M",
          technologies: ["React", "Node.js", "AWS"],
          recentFunding: "$1.5M Pre-seed",
          recentNews: "Featured on TechCrunch"
        }
      }
    ]).returning();

    // Create comprehensive integrations
    const demoIntegrations = await db.insert(integrations).values([
      {
        type: "smartlead",
        userId: 1,
        isConnected: true,
        credentials: {
          apiKey: "sl_live_xxxxxxxxxxxxx",
          accountId: "12847"
        },
        settings: {
          webhookUrl: "https://sparqai.com/webhooks/smartlead",
          syncFrequency: "realtime",
          campaignSync: true,
          leadSync: true,
          statsSync: true
        }
      },
      {
        type: "linkedin",
        userId: 1,
        isConnected: true,
        credentials: {
          accessToken: "AQXdSP_xxxxxxxxxxxxx",
          refreshToken: "AQXdSP_yyyyyyyyyyyy"
        },
        settings: {
          connectionLimit: 100,
          messageLimit: 50,
          dailyLimit: 20,
          useLinkedinSales: true,
          autoConnect: false
        }
      },
      {
        type: "salesforce",
        userId: 1,
        isConnected: true,
        credentials: {
          instanceUrl: "https://sparqai.lightning.force.com",
          accessToken: "00D7F0000xxxxxxxxxxxxx",
          refreshToken: "5Aep861TSxxxxxxxxxxxxxx"
        },
        settings: {
          leadSync: true,
          contactSync: true,
          opportunitySync: true,
          customFields: ["Lead_Score__c", "Campaign_Source__c"],
          syncDirection: "bidirectional"
        }
      },
      {
        type: "hubspot",
        userId: 1,
        isConnected: false,
        credentials: {},
        settings: {
          contactSync: true,
          dealSync: true,
          companySync: true,
          customProperties: []
        }
      },
      {
        type: "openai",
        userId: 1,
        isConnected: true,
        credentials: {
          apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },
        settings: {
          model: "gpt-4o",
          temperature: 0.7,
          maxTokens: 1000,
          useForPersonalization: true,
          useForLeadScoring: true,
          useForInsights: true
        }
      }
    ]).returning();

    // Create comprehensive activities
    const demoActivities = await db.insert(activities).values([
      {
        type: "campaign_launched",
        description: "Launched 'Q1 2025 Enterprise SaaS Outreach' campaign with 245 prospects",
        userId: 1,
        campaignId: demoCampaigns[0].id,
        metadata: {
          campaignName: "Q1 2025 Enterprise SaaS Outreach",
          prospectCount: 245,
          channels: ["email", "linkedin"],
          budget: 15000
        },
        createdAt: new Date('2025-01-01T09:00:00Z')
      },
      {
        type: "meeting_scheduled",
        description: "Meeting scheduled with Sarah Chen (VP of Sales at TechCorp Solutions)",
        userId: 1,
        campaignId: demoCampaigns[0].id,
        contactId: demoContacts[0].id,
        metadata: {
          contactName: "Sarah Chen",
          company: "TechCorp Solutions",
          meetingDate: "2025-01-08T15:00:00Z",
          platform: "Zoom",
          dealValue: 50000
        },
        createdAt: new Date('2025-01-04T14:30:00Z')
      },
      {
        type: "lead_qualified",
        description: "Jennifer Rodriguez qualified as high-value lead (Score: 94)",
        userId: 1,
        campaignId: demoCampaigns[1].id,
        contactId: demoContacts[2].id,
        metadata: {
          leadScore: 94,
          qualificationCriteria: ["Budget confirmed", "Decision maker", "Timeline Q1"],
          estimatedValue: 75000
        },
        createdAt: new Date('2025-01-03T11:20:00Z')
      },
      {
        type: "response_received",
        description: "Positive response from Michael Torres showing interest in demo",
        userId: 1,
        campaignId: demoCampaigns[0].id,
        contactId: demoContacts[1].id,
        metadata: {
          responseType: "positive",
          sentiment: "interested",
          nextAction: "schedule_demo",
          responseText: "This looks interesting, can we schedule a 30min demo?"
        },
        createdAt: new Date('2025-01-03T16:45:00Z')
      },
      {
        type: "integration_connected",
        description: "Successfully connected Salesforce integration",
        userId: 1,
        metadata: {
          integrationType: "salesforce",
          instanceUrl: "https://sparqai.lightning.force.com",
          syncEnabled: true,
          recordsToSync: 1247
        },
        createdAt: new Date('2025-01-02T10:15:00Z')
      },
      {
        type: "campaign_paused",
        description: "Paused 'European Market Expansion' campaign for budget review",
        userId: 1,
        campaignId: demoCampaigns[2].id,
        metadata: {
          reason: "budget_review",
          spentAmount: 2100,
          budgetLimit: 8000,
          results: { meetings: 6, pipeline: 125000 }
        },
        createdAt: new Date('2024-12-28T09:30:00Z')
      },
      {
        type: "ai_insight_generated",
        description: "AI identified optimal outreach timing: Tuesday-Thursday 10-11 AM shows 23% higher response rates",
        userId: 1,
        metadata: {
          insightType: "timing_optimization",
          impact: "23% higher response rate",
          recommendation: "Schedule outreach Tuesday-Thursday 10-11 AM",
          dataPoints: 1847,
          confidence: 0.87
        },
        createdAt: new Date('2025-01-01T08:00:00Z')
      },
      {
        type: "milestone_reached",
        description: "Reached 1000+ qualified leads milestone this quarter",
        userId: 1,
        metadata: {
          milestone: "1000_qualified_leads",
          quarter: "Q1 2025",
          previousRecord: 847,
          improvement: "18% increase"
        },
        createdAt: new Date('2025-01-04T17:00:00Z')
      }
    ]).returning();

    console.log('✅ Database seeded successfully with comprehensive demo data!');
    console.log(`Created:
    - 1 demo user
    - 1 company
    - ${demoProducts.length} products
    - ${demoCampaigns.length} campaigns
    - ${demoContacts.length} contacts
    - ${demoIntegrations.length} integrations
    - ${demoActivities.length} activities`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding function
seedDatabase().catch(console.error);