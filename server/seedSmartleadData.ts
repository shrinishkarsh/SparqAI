import { db } from "./db";
import { smartleadCampaigns, smartleadLeads, smartleadStats } from "@shared/schema";

export async function seedSmartleadData() {
  try {
    console.log('Seeding Smartlead demo data...');

    // Clear existing Smartlead data
    await db.delete(smartleadStats);
    await db.delete(smartleadLeads);
    await db.delete(smartleadCampaigns);

    // Create Smartlead campaigns
    const demoSmartleadCampaigns = await db.insert(smartleadCampaigns).values([
      {
        name: "Q1 Enterprise SaaS Outreach",
        userId: 1,
        smartleadId: 12847,
        status: "ACTIVE",
        smartleadUserId: 5432,
        trackSettings: JSON.stringify({
          trackOpens: true,
          trackClicks: true,
          trackReplies: true,
          unsubscribeTracking: true
        }),
        schedulerCronValue: "0 9 * * 1-5", // Weekdays at 9 AM
        totalLeadsCount: 842,
        totalEmailsSent: 2847,
        totalUniqueOpens: 387,
        totalUniqueClicks: 156,
        totalReplies: 94,
        totalBounces: 23,
        totalUnsubscribes: 8,
        replyPercentage: 11.2,
        openPercentage: 45.9,
        clickPercentage: 18.5,
        bouncePercentage: 2.7,
        unsubscribePercentage: 0.9,
        followUpPercentage: 67
      },
      {
        name: "Mid-Market RevOps Campaign",
        userId: 1,
        smartleadId: 12848,
        status: "ACTIVE",
        smartleadUserId: 5432,
        trackSettings: JSON.stringify({
          trackOpens: true,
          trackClicks: true,
          trackReplies: true,
          unsubscribeTracking: true
        }),
        schedulerCronValue: "0 10 * * 2,4", // Tuesday and Thursday at 10 AM
        totalLeadsCount: 623,
        totalEmailsSent: 1867,
        totalUniqueOpens: 249,
        totalUniqueClicks: 98,
        totalReplies: 56,
        totalBounces: 15,
        totalUnsubscribes: 5,
        replyPercentage: 9.0,
        openPercentage: 40.0,
        clickPercentage: 15.7,
        bouncePercentage: 2.4,
        unsubscribePercentage: 0.8,
        followUpPercentage: 72.1
      },
      {
        name: "European Market Expansion",
        userId: 1,
        smartleadId: 12849,
        status: "PAUSED",
        smartleadUserId: 5432,
        trackSettings: JSON.stringify({
          trackOpens: true,
          trackClicks: true,
          trackReplies: true,
          unsubscribeTracking: true
        }),
        schedulerCronValue: "0 14 * * 1,3,5", // Mon, Wed, Fri at 2 PM (EU time)
        totalLeadsCount: 234,
        totalEmailsSent: 567,
        totalUniqueOpens: 89,
        totalUniqueClicks: 34,
        totalReplies: 18,
        totalBounces: 8,
        totalUnsubscribes: 2,
        replyPercentage: 7.7,
        openPercentage: 38.0,
        clickPercentage: 14.5,
        bouncePercentage: 3.4,
        unsubscribePercentage: 0.9,
        followUpPercentage: 58.1
      }
    ]).returning();

    // Create Smartlead leads
    const demoSmartleadLeads = await db.insert(smartleadLeads).values([
      {
        email: "sarah.chen@techcorp.com",
        firstName: "Sarah",
        lastName: "Chen",
        website: "https://techcorp.com",
        userId: 1,
        campaignId: demoSmartleadCampaigns[0].id,
        smartleadCampaignId: 12847,
        leadStatus: "INTERESTED",
        customFields: JSON.stringify({
          company: "TechCorp Solutions",
          jobTitle: "VP of Sales",
          industry: "Software",
          companySize: "250",
          location: "San Francisco, CA"
        }),
        tags: JSON.stringify(["enterprise", "qualified", "hot-lead"]),
        sequenceNumber: 3,
        sequenceStep: 2,
        emailsSent: 3,
        emailsOpened: 2,
        emailsClicked: 1,
        emailsReplied: 1,
        emailsBounced: 0,
        isUnsubscribed: false
      },
      {
        email: "michael.torres@growthsaas.io",
        firstName: "Michael",
        lastName: "Torres",
        website: "https://growthsaas.io",
        userId: 1,
        campaignId: demoSmartleadCampaigns[0].id,
        smartleadCampaignId: 12847,
        leadStatus: "MEETING_SCHEDULED",
        customFields: JSON.stringify({
          company: "GrowthSaaS",
          jobTitle: "Sales Director",
          industry: "Marketing Technology",
          companySize: "180",
          location: "Austin, TX"
        }),
        tags: JSON.stringify(["mid-market", "demo-scheduled", "qualified"]),
        sequenceNumber: 2,
        sequenceStep: 4,
        emailsSent: 4,
        emailsOpened: 3,
        emailsClicked: 2,
        emailsReplied: 1,
        emailsBounced: 0,
        isUnsubscribed: false
      },
      {
        email: "jennifer.rodriguez@scaleup.com",
        firstName: "Jennifer",
        lastName: "Rodriguez",
        website: "https://scaleup.com",
        userId: 1,
        campaignId: demoSmartleadCampaigns[1].id,
        smartleadCampaignId: 12848,
        leadStatus: "REPLIED",
        customFields: JSON.stringify({
          company: "ScaleUp Inc",
          jobTitle: "RevOps Director",
          industry: "Financial Services",
          companySize: "120",
          location: "New York, NY"
        }),
        tags: JSON.stringify(["revops", "qualified", "high-intent"]),
        sequenceNumber: 1,
        sequenceStep: 3,
        emailsSent: 3,
        emailsOpened: 3,
        emailsClicked: 1,
        emailsReplied: 1,
        emailsBounced: 0,
        isUnsubscribed: false
      },
      {
        email: "david.kim@innovatetech.co.uk",
        firstName: "David",
        lastName: "Kim",
        website: "https://innovatetech.co.uk",
        userId: 1,
        campaignId: demoSmartleadCampaigns[2].id,
        smartleadCampaignId: 12849,
        leadStatus: "OPENED",
        customFields: JSON.stringify({
          company: "InnovateTech Ltd",
          jobTitle: "Head of Sales",
          industry: "Software",
          companySize: "95",
          location: "London, UK"
        }),
        tags: JSON.stringify(["europe", "uk-market", "warm"]),
        sequenceNumber: 1,
        sequenceStep: 2,
        emailsSent: 2,
        emailsOpened: 1,
        emailsClicked: 0,
        emailsReplied: 0,
        emailsBounced: 0,
        isUnsubscribed: false
      },
      {
        email: "alex.founder@techstartup.com",
        firstName: "Alex",
        lastName: "Founder",
        website: "https://techstartup.com",
        userId: 1,
        campaignId: demoSmartleadCampaigns[0].id,
        smartleadCampaignId: 12847,
        leadStatus: "CUSTOMER",
        customFields: JSON.stringify({
          company: "TechStartup Inc",
          jobTitle: "CEO",
          industry: "Technology",
          companySize: "25",
          location: "Silicon Valley, CA"
        }),
        tags: JSON.stringify(["startup", "founder", "closed-won"]),
        sequenceNumber: 3,
        sequenceStep: 5,
        emailsSent: 5,
        emailsOpened: 5,
        emailsClicked: 3,
        emailsReplied: 2,
        emailsBounced: 0,
        isUnsubscribed: false
      }
    ]).returning();

    // Create Smartlead stats
    const demoSmartleadStats = await db.insert(smartleadStats).values([
      {
        userId: 1,
        campaignId: demoSmartleadCampaigns[0].id,
        leadId: demoSmartleadLeads[0].id,
        leadEmail: "sarah.chen@techcorp.com",
        sequenceNumber: 3,
        sequenceStep: 2,
        emailsSent: 3,
        emailsOpened: 2,
        emailsClicked: 1,
        emailsReplied: 1,
        emailsBounced: 0,
        lastActivity: new Date('2025-01-04T14:30:00Z'),
        leadStatus: "INTERESTED",
        responseCount: 1,
        positiveReplyCount: 1,
        neutralReplyCount: 0,
        negativeReplyCount: 0,
        interestedCount: 1,
        notInterestedCount: 0,
        unsubscribeCount: 0,
        bounceCount: 0
      },
      {
        userId: 1,
        campaignId: demoSmartleadCampaigns[0].id,
        leadId: demoSmartleadLeads[1].id,
        leadEmail: "michael.torres@growthsaas.io",
        sequenceNumber: 2,
        sequenceStep: 4,
        emailsSent: 4,
        emailsOpened: 3,
        emailsClicked: 2,
        emailsReplied: 1,
        emailsBounced: 0,
        lastActivity: new Date('2025-01-03T16:45:00Z'),
        leadStatus: "MEETING_SCHEDULED",
        responseCount: 1,
        positiveReplyCount: 1,
        neutralReplyCount: 0,
        negativeReplyCount: 0,
        interestedCount: 1,
        notInterestedCount: 0,
        unsubscribeCount: 0,
        bounceCount: 0
      },
      {
        userId: 1,
        campaignId: demoSmartleadCampaigns[1].id,
        leadId: demoSmartleadLeads[2].id,
        leadEmail: "jennifer.rodriguez@scaleup.com",
        sequenceNumber: 1,
        sequenceStep: 3,
        emailsSent: 3,
        emailsOpened: 3,
        emailsClicked: 1,
        emailsReplied: 1,
        emailsBounced: 0,
        lastActivity: new Date('2025-01-02T11:20:00Z'),
        leadStatus: "REPLIED",
        responseCount: 1,
        positiveReplyCount: 1,
        neutralReplyCount: 0,
        negativeReplyCount: 0,
        interestedCount: 1,
        notInterestedCount: 0,
        unsubscribeCount: 0,
        bounceCount: 0
      }
    ]).returning();

    console.log('✅ Smartlead demo data seeded successfully!');
    console.log(`Created:
    - ${demoSmartleadCampaigns.length} Smartlead campaigns
    - ${demoSmartleadLeads.length} Smartlead leads
    - ${demoSmartleadStats.length} Smartlead stats records`);

  } catch (error) {
    console.error('❌ Error seeding Smartlead data:', error);
    throw error;
  }
}

// Run the seeding function
seedSmartleadData().catch(console.error);