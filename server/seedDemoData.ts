import { db } from "./db";
import { 
  companies, campaigns, contacts, activities, integrations, products,
  smartleadCampaigns, smartleadLeads, smartleadStats 
} from "@shared/schema";

export async function seedDemoData() {
  try {
    console.log('Seeding comprehensive demo data...');

    // Clear existing data
    await db.delete(smartleadStats);
    await db.delete(smartleadLeads);
    await db.delete(smartleadCampaigns);
    await db.delete(activities);
    await db.delete(contacts);
    await db.delete(campaigns);
    await db.delete(products);
    await db.delete(companies);

    // Create demo company for the authenticated user
    const [demoCompany] = await db.insert(companies).values({
      userId: "42238159", // Use the actual authenticated user ID
      name: "SparqAI Technologies",
      website: "https://sparqai.com",
      description: "AI-powered sales development platform helping businesses automate and optimize their outreach campaigns",
      industry: "Technology",
      size: "51-200 employees",
      targetIcp: "Mid-market B2B SaaS companies with 50-500 employees looking to scale their sales operations",
      targetMarket: "B2B SaaS, Technology, Financial Services",
      valueProposition: "Increase sales qualified leads by 300% while reducing manual outreach time by 80%",
      idealCustomerProfile: "VP Sales, Sales Directors, RevOps leaders at growing SaaS companies",
      companyGoals: "Scale to $10M ARR, expand to European markets, build world-class sales automation platform",
      salesProcess: "Inbound + Outbound SDR motion with multi-channel sequences",
      competitiveAdvantage: "AI-powered personalization at scale with best-in-class deliverability",
      revenueModel: "SaaS subscription with usage-based pricing tiers",
      geographicFocus: "North America, expanding to Europe and APAC"
    }).returning();

    // Create products with detailed metrics
    const demoProducts = await db.insert(products).values([
      {
        name: "SparqAI Pro",
        userId: "42238159",
        companyId: demoCompany.id,
        description: "Professional AI sales automation platform for growing teams",
        competitiveAdvantage: "AI-powered personalization with 40% higher response rates",
        targetMarket: "Mid-market B2B companies with 50-200 employees",
        pricing: "$299/month per user, annual plans available",
        stage: "Growth",
        launchDate: new Date('2024-03-15'),
        features: [
          "AI email personalization", 
          "Multi-channel sequences", 
          "Lead scoring & enrichment",
          "CRM integrations",
          "Advanced analytics"
        ],
        metrics: {
          mrr: 89000,
          customers: 156,
          churn: 2.1,
          cac: 850,
          ltv: 12500,
          nps: 67
        },
        isActive: true
      },
      {
        name: "SparqAI Enterprise",
        userId: "42238159", 
        companyId: demoCompany.id,
        description: "Enterprise-grade sales automation with advanced AI and compliance features",
        competitiveAdvantage: "Enterprise security, custom AI models, dedicated support",
        targetMarket: "Enterprise companies 500+ employees with complex sales processes",
        pricing: "$899/month per user, custom enterprise pricing",
        stage: "Expansion", 
        launchDate: new Date('2024-06-01'),
        features: [
          "Custom AI models",
          "Enterprise security & compliance", 
          "Advanced workflow automation",
          "Dedicated customer success",
          "Custom integrations"
        ],
        metrics: {
          mrr: 156000,
          customers: 23,
          churn: 1.2,
          cac: 3200,
          ltv: 45000,
          nps: 78
        },
        isActive: true
      },
      {
        name: "SparqAI Starter",
        userId: "42238159",
        companyId: demoCompany.id, 
        description: "Entry-level AI sales tools for small teams and solopreneurs",
        competitiveAdvantage: "Affordable AI automation with easy setup and great support",
        targetMarket: "Small businesses and startups with 1-10 employees",
        pricing: "$49/month per user, 14-day free trial",
        stage: "Launch",
        launchDate: new Date('2024-11-01'),
        features: [
          "Basic AI personalization",
          "Email sequences", 
          "Contact management",
          "Basic analytics",
          "Email support"
        ],
        metrics: {
          mrr: 12000,
          customers: 87,
          churn: 5.8,
          cac: 120,
          ltv: 2800,
          nps: 52
        },
        isActive: true
      }
    ]).returning();

    // Create comprehensive campaigns with detailed performance metrics
    const demoCampaigns = await db.insert(campaigns).values([
      {
        userId: "42238159",
        companyId: demoCompany.id,
        productId: demoProducts[0].id,
        name: "Q1 Enterprise SaaS Outreach",
        description: "Targeting VP Sales and Revenue Operations leaders at mid-market SaaS companies",
        status: "active",
        targetAudience: "VP Sales, RevOps Directors, Sales Directors at 50-500 employee SaaS companies",
        messageTemplate: "Hi {{firstName}}, I noticed {{company}} has been scaling rapidly. Are you evaluating new tools to help your sales team hit their ambitious growth targets?",
        sequences: {
          email: { steps: 6, delay: 3 },
          linkedin: { steps: 4, delay: 2 },
          phone: { steps: 2, delay: 7 }
        },
        sent: 1247,
        opened: 562,
        replied: 187,
        clicked: 94,
        bounced: 18,
        unsubscribed: 12,
        meetings: 31,
        deals: 8,
        revenue: 67500,
        roi: 340
      },
      {
        userId: "42238159", 
        companyId: demoCompany.id,
        productId: demoProducts[1].id,
        name: "Enterprise Security & Compliance",
        description: "Targeting enterprise IT and security leaders for our compliance-focused solution",
        status: "active",
        targetAudience: "CISOs, IT Directors, Compliance Officers at 500+ employee companies",
        messageTemplate: "Hi {{firstName}}, with {{company}}'s recent growth, I imagine data security and compliance are top priorities. Are you evaluating new solutions for sales automation that meet enterprise security standards?",
        sequences: {
          email: { steps: 8, delay: 5 },
          linkedin: { steps: 3, delay: 3 },
          phone: { steps: 3, delay: 10 }
        },
        sent: 432,
        opened: 198,
        replied: 52,
        clicked: 31,
        bounced: 8,
        unsubscribed: 3,
        meetings: 18,
        deals: 7,
        revenue: 245000,
        roi: 680
      },
      {
        userId: "42238159",
        companyId: demoCompany.id, 
        productId: demoProducts[0].id,
        name: "Financial Services Expansion",
        description: "Targeting fintech and financial services companies for specialized automation",
        status: "active", 
        targetAudience: "CFOs, Sales VPs, Growth leaders at fintech and financial services companies",
        messageTemplate: "Hi {{firstName}}, I saw {{company}}'s recent funding announcement - congratulations! With your growth trajectory, are you looking to scale your sales operations more efficiently?",
        sequences: {
          email: { steps: 5, delay: 4 },
          linkedin: { steps: 5, delay: 2 },
          phone: { steps: 1, delay: 12 }
        },
        sent: 789,
        opened: 367,
        replied: 98,
        clicked: 67,
        bounced: 12,
        unsubscribed: 7,
        meetings: 22,
        deals: 5,
        revenue: 89000,
        roi: 285
      },
      {
        userId: "42238159",
        companyId: demoCompany.id,
        productId: demoProducts[2].id, 
        name: "Startup Growth Campaign",
        description: "Helping early-stage startups build scalable sales processes from day one",
        status: "launching",
        targetAudience: "Founders, Head of Sales, Growth leaders at Series A-B startups", 
        messageTemplate: "Hi {{firstName}}, building a predictable sales machine is crucial for {{company}}'s next funding round. Are you looking for affordable ways to automate and scale your outreach?",
        sequences: {
          email: { steps: 4, delay: 2 },
          linkedin: { steps: 6, delay: 1 },
          phone: { steps: 1, delay: 5 }
        },
        sent: 156,
        opened: 89,
        replied: 23,
        clicked: 18,
        bounced: 3,
        unsubscribed: 1,
        meetings: 8,
        deals: 3,
        revenue: 8700,
        roi: 145
      },
      {
        userId: "42238159",
        companyId: demoCompany.id,
        productId: demoProducts[0].id,
        name: "European Market Entry", 
        description: "Expanding our reach to European B2B SaaS companies",
        status: "paused",
        targetAudience: "Sales Directors, Revenue leaders at European SaaS companies",
        messageTemplate: "Hi {{firstName}}, I hope this message finds you well. {{company}} has built an impressive presence in the European market. Are you exploring new ways to accelerate your sales growth?",
        sequences: {
          email: { steps: 7, delay: 4 },
          linkedin: { steps: 4, delay: 3 },
          phone: { steps: 2, delay: 8 }
        },
        sent: 234,
        opened: 98,
        replied: 19,
        clicked: 12,
        bounced: 5,
        unsubscribed: 2,
        meetings: 4,
        deals: 1,
        revenue: 12000,
        roi: 95
      }
    ]).returning();

    // Create high-quality contacts with enrichment data
    const demoContacts = await db.insert(contacts).values([
      {
        email: "sarah.chen@techflow.com", 
        firstName: "Sarah",
        lastName: "Chen",
        userId: "42238159",
        campaignId: demoCampaigns[0].id,
        company: "TechFlow Solutions",
        jobTitle: "VP of Sales",
        industry: "Software",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        phoneNumber: "+1-555-0123",
        status: "interested",
        leadScore: 92,
        lastContactedAt: new Date('2025-01-03T14:30:00Z'),
        responseReceived: true,
        meetingScheduled: true,
        enrichmentData: {
          companySize: "180 employees",
          revenue: "$15M ARR", 
          location: "San Francisco, CA",
          technologies: ["Salesforce", "HubSpot", "Outreach"],
          recentNews: "Raised $8M Series B",
          intent: "high"
        }
      },
      {
        email: "michael.torres@growthsaas.io",
        firstName: "Michael", 
        lastName: "Torres",
        userId: "42238159",
        campaignId: demoCampaigns[0].id,
        company: "GrowthSaaS",
        jobTitle: "Director of Revenue Operations",
        industry: "Marketing Technology",
        linkedinUrl: "https://linkedin.com/in/michaeltorres",
        phoneNumber: "+1-555-0234", 
        status: "meeting_scheduled",
        leadScore: 87,
        lastContactedAt: new Date('2025-01-02T16:45:00Z'),
        responseReceived: true,
        meetingScheduled: true,
        enrichmentData: {
          companySize: "95 employees",
          revenue: "$8M ARR",
          location: "Austin, TX", 
          technologies: ["Pipedrive", "Marketo", "Gong"],
          recentNews: "Expanding to European market",
          intent: "high"
        }
      },
      {
        email: "jennifer.rodriguez@financetech.com",
        firstName: "Jennifer",
        lastName: "Rodriguez", 
        userId: "42238159",
        campaignId: demoCampaigns[2].id,
        company: "FinanceTech Innovations",
        jobTitle: "Head of Sales",
        industry: "Financial Technology",
        linkedinUrl: "https://linkedin.com/in/jenniferrodriguez",
        phoneNumber: "+1-555-0345",
        status: "replied",
        leadScore: 84,
        lastContactedAt: new Date('2025-01-01T11:20:00Z'),
        responseReceived: true,
        meetingScheduled: false,
        enrichmentData: {
          companySize: "120 employees", 
          revenue: "$12M ARR",
          location: "New York, NY",
          technologies: ["Salesforce", "ZoomInfo", "Apollo"],
          recentNews: "Launched new product line",
          intent: "medium"
        }
      },
      {
        email: "david.kim@innovateuk.co.uk",
        firstName: "David",
        lastName: "Kim",
        userId: "42238159", 
        campaignId: demoCampaigns[4].id,
        company: "InnovateUK Ltd",
        jobTitle: "Sales Director",
        industry: "Software",
        linkedinUrl: "https://linkedin.com/in/davidkim",
        phoneNumber: "+44-20-1234-5678",
        status: "opened",
        leadScore: 76,
        lastContactedAt: new Date('2024-12-28T09:15:00Z'),
        responseReceived: false,
        meetingScheduled: false,
        enrichmentData: {
          companySize: "85 employees",
          revenue: "£6M ARR", 
          location: "London, UK",
          technologies: ["HubSpot", "Intercom", "Slack"],
          recentNews: "Opening new European office",
          intent: "low"
        }
      },
      {
        email: "alex.startup@techventure.com",
        firstName: "Alex",
        lastName: "Founder",
        userId: "42238159",
        campaignId: demoCampaigns[3].id,
        company: "TechVenture Inc",
        jobTitle: "CEO & Founder", 
        industry: "Technology",
        linkedinUrl: "https://linkedin.com/in/alexfounder",
        phoneNumber: "+1-555-0456",
        status: "customer",
        leadScore: 95,
        lastContactedAt: new Date('2024-12-15T13:45:00Z'),
        responseReceived: true,
        meetingScheduled: true,
        enrichmentData: {
          companySize: "25 employees",
          revenue: "$2M ARR",
          location: "Silicon Valley, CA",
          technologies: ["Linear", "Notion", "Stripe"], 
          recentNews: "Closed $3M seed round",
          intent: "converted"
        }
      },
      {
        email: "maria.gonzalez@enterprise.com",
        firstName: "Maria",
        lastName: "Gonzalez",
        userId: "42238159",
        campaignId: demoCampaigns[1].id,
        company: "Enterprise Solutions Corp",
        jobTitle: "CISO",
        industry: "Enterprise Software",
        linkedinUrl: "https://linkedin.com/in/mariagonzalez",
        phoneNumber: "+1-555-0567",
        status: "nurturing",
        leadScore: 81,
        lastContactedAt: new Date('2024-12-20T10:30:00Z'),
        responseReceived: false,
        meetingScheduled: false,
        enrichmentData: {
          companySize: "850 employees",
          revenue: "$120M ARR",
          location: "Chicago, IL",
          technologies: ["Microsoft", "Okta", "CrowdStrike"],
          recentNews: "Implementing zero-trust security",
          intent: "medium"
        }
      }
    ]).returning();

    // Create detailed activities with AI insights
    const demoActivities = await db.insert(activities).values([
      {
        userId: "42238159",
        campaignId: demoCampaigns[0].id,
        contactId: demoContacts[0].id,
        type: "meeting_scheduled",
        description: "Demo meeting scheduled with Sarah Chen (TechFlow Solutions) for next Tuesday. High intent - asked specific questions about API integrations and pricing for 50-user team.",
        metadata: {
          meetingTime: "2025-01-07T15:00:00Z",
          platform: "Zoom",
          attendees: ["Sarah Chen", "Mike Stevens (CTO)"],
          notes: "Very interested in custom AI models and Salesforce integration",
          aiInsight: "High conversion probability - matches ICP perfectly and showed strong buying signals"
        }
      },
      {
        userId: "42238159", 
        campaignId: demoCampaigns[0].id,
        contactId: demoContacts[1].id,
        type: "positive_reply",
        description: "Michael Torres replied positively to follow-up email. Interested in ROI calculator and wants to see case studies from similar RevOps teams.",
        metadata: {
          replyTime: "2025-01-02T16:45:00Z",
          sentiment: "positive",
          keywords: ["ROI", "case studies", "RevOps"],
          nextAction: "Send ROI calculator and GrowthHack case study",
          aiInsight: "Strong interest signal - asking for proof points indicates serious evaluation"
        }
      },
      {
        userId: "42238159",
        campaignId: demoCampaigns[2].id, 
        contactId: demoContacts[2].id,
        type: "email_opened",
        description: "Jennifer Rodriguez opened our fintech case study email 3 times. High engagement signal - likely sharing internally.",
        metadata: {
          openCount: 3,
          timeSpent: "4 minutes 32 seconds",
          clickedLinks: ["case study", "pricing"],
          deviceInfo: "Desktop - work hours",
          aiInsight: "Multiple opens suggest internal sharing - good sign for enterprise deal"
        }
      },
      {
        userId: "42238159",
        campaignId: demoCampaigns[1].id,
        contactId: demoContacts[5].id,
        type: "linkedin_connected",
        description: "Maria Gonzalez accepted LinkedIn connection and viewed our profile. Enterprise security focus - good fit for our compliance features.",
        metadata: {
          platform: "LinkedIn",
          connectionDate: "2024-12-20T10:30:00Z", 
          profileViews: 2,
          mutualConnections: 15,
          aiInsight: "Enterprise CISO showing interest - emphasize security and compliance in follow-up"
        }
      },
      {
        userId: "42238159",
        campaignId: demoCampaigns[3].id,
        contactId: demoContacts[4].id,
        type: "deal_closed",
        description: "Alex Founder signed annual contract for SparqAI Starter plan. $588 ARR from seed-stage startup. Great success story for founder outreach.",
        metadata: {
          dealValue: 588,
          contractType: "Annual",
          product: "SparqAI Starter",
          salesCycle: "18 days",
          aiInsight: "Fast conversion from founder segment - optimize messaging for other early-stage startups"
        }
      },
      {
        userId: "42238159",
        campaignId: demoCampaigns[0].id,
        type: "campaign_optimized", 
        description: "AI optimization increased Enterprise SaaS campaign reply rate from 12% to 18% by improving subject lines and personalization.",
        metadata: {
          optimizationType: "subject_lines_and_personalization",
          previousRate: 12,
          newRate: 18,
          improvement: "50% increase",
          aiInsight: "Personalization around recent funding events driving higher engagement"
        }
      },
      {
        userId: "42238159",
        campaignId: demoCampaigns[2].id,
        type: "sequence_completed",
        description: "Financial Services sequence completed for 45 contacts. 31% positive response rate, 8 meetings scheduled. Strong performance in fintech vertical.",
        metadata: {
          contactsCompleted: 45,
          responseRate: 31,
          meetingsScheduled: 8,
          verticalPerformance: "above average",
          aiInsight: "Fintech messaging resonating well - consider expanding this vertical"
        }
      },
      {
        userId: "42238159",
        type: "lead_scoring_update",
        description: "AI model updated lead scoring algorithm based on 500+ new data points. Improved prediction accuracy by 23% for meeting likelihood.",
        metadata: {
          dataPoints: 500,
          accuracyImprovement: 23,
          modelVersion: "v2.1",
          trainingData: "Q4 2024 campaign results",
          aiInsight: "Job title and company growth signals are strongest predictors of meeting acceptance"
        }
      }
    ]).returning();

    // Create comprehensive integrations
    const demoIntegrations = await db.insert(integrations).values([
      {
        userId: "42238159",
        type: "salesforce",
        isConnected: true,
        credentials: {
          instanceUrl: "https://sparqai.my.salesforce.com",
          lastSync: "2025-01-05T08:30:00Z"
        },
        settings: {
          autoSync: true,
          syncFrequency: "real-time",
          fieldsMapping: {
            "leadSource": "SparqAI Campaign",
            "leadStatus": "New",
            "ownerId": "0051234567890ABC"
          },
          recordsCreated: 1247,
          recordsUpdated: 892,
          lastSuccessfulSync: "2025-01-05T08:30:00Z"
        }
      },
      {
        userId: "42238159", 
        type: "linkedin",
        isConnected: true,
        credentials: {
          profileId: "sparqai-sales",
          connectionCount: 2847,
          lastActivity: "2025-01-05T12:15:00Z"
        },
        settings: {
          dailyConnectionLimit: 15,
          messageTemplate: "personalized",
          connectionsSent: 456,
          connectionsAccepted: 298,
          acceptanceRate: 65.4,
          messagesDelivered: 234,
          responseRate: 23.5
        }
      },
      {
        userId: "42238159",
        type: "smartlead",
        isConnected: true,
        credentials: {
          apiKey: "sl_live_*****",
          userId: 5432,
          lastSync: "2025-01-05T09:45:00Z"
        },
        settings: {
          emailsPerDay: 150,
          warmupEnabled: true,
          campaignsActive: 5,
          totalEmailsSent: 4726,
          deliveryRate: 97.8,
          openRate: 45.2,
          replyRate: 11.7,
          bounceRate: 2.2
        }
      },
      {
        userId: "42238159",
        type: "openai",
        isConnected: true,
        credentials: {
          model: "gpt-4",
          lastUsed: "2025-01-05T14:20:00Z"
        },
        settings: {
          monthlyTokensUsed: 89450,
          monthlyTokensLimit: 100000,
          avgResponseTime: "1.2s",
          personalizedEmails: 1567,
          leadScoresGenerated: 892,
          campaignOptimizations: 23,
          accuracyScore: 94.2
        }
      },
      {
        userId: "42238159",
        type: "hubspot",
        isConnected: false,
        credentials: {},
        settings: {
          status: "available",
          features: ["CRM sync", "Deal tracking", "Contact enrichment"],
          estimatedSetupTime: "5 minutes"
        }
      }
    ]).returning();

    console.log('✅ Comprehensive demo data seeded successfully!');
    console.log(`Created:
    - 1 company profile with detailed information
    - 3 products with realistic metrics and pricing
    - 5 campaigns with comprehensive performance data
    - 6 high-quality contacts with enrichment data
    - 8 detailed activities with AI insights
    - 5 integrations with real usage statistics`);

    return {
      company: demoCompany,
      products: demoProducts,
      campaigns: demoCampaigns, 
      contacts: demoContacts,
      activities: demoActivities,
      integrations: demoIntegrations
    };

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
}

// Run the seeding function
seedDemoData().catch(console.error);