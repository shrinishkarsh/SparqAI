import fetch, { RequestInit } from 'node-fetch';

interface SmartleadConfig {
  apiKey: string;
  baseUrl: string;
}

export interface SmartleadCampaign {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  status: 'DRAFTED' | 'ACTIVE' | 'COMPLETED' | 'STOPPED' | 'PAUSED';
  name: string;
  track_settings: string;
  scheduler_cron_value: string;
  min_time_btwn_emails: number;
  max_leads_per_day: number;
  stop_lead_settings: string;
  unsubscribe_text: string;
  client_id: number | null;
  enable_ai_esp_matching: boolean;
  send_as_plain_text: boolean;
  follow_up_percentage: number;
}

export interface SmartleadLead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  website: string;
  location: string;
  custom_fields: Record<string, any>;
  linkedin_profile: string;
  company_url: string;
  is_unsubscribed: boolean;
}

export interface SmartleadCampaignLead {
  campaign_lead_map_id: number;
  status: 'STARTED' | 'COMPLETED' | 'BLOCKED' | 'INPROGRESS' | 'SENT';
  created_at: string;
  lead: SmartleadLead;
}

export interface SmartleadLeadStats {
  total_leads: number;
  offset: number;
  limit: number;
  data: SmartleadCampaignLead[];
}

export interface SmartleadCampaignStats {
  total_stats: string;
  data: SmartleadStatItem[];
}

export interface SmartleadStatItem {
  lead_name: string;
  lead_email: string;
  lead_category: string | null;
  sequence_number: number;
  email_campaign_seq_id: number;
  seq_variant_id: number;
  email_subject: string;
  email_message: string;
  sent_time: string;
  open_time: string | null;
  click_time: string | null;
  reply_time: string | null;
  unsubscribed_time: string | null;
  bounced_time: string | null;
  lead_status: string;
  open_count: number;
  click_count: number;
  reply_count: number;
  unsubscribe_count: number;
  bounce_count: number;
}

export interface SmartleadEmailAccount {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  from_name: string;
  from_email: string;
  username: string;
  smtp_host: string;
  smtp_port: number;
  smtp_port_type: string;
  message_per_day: number;
  different_reply_to_address: string;
  is_different_imap_account: boolean;
  imap_username: string;
  imap_host: string;
  imap_port: number;
  imap_port_type: string;
  signature: string;
  custom_tracking_domain: string;
  bcc_email: string;
  is_smtp_success: boolean;
  is_imap_success: boolean;
  smtp_failure_error: string;
  imap_failure_error: string;
  type: 'GMAIL' | 'ZOHO' | 'OUTLOOK' | 'SMTP';
  daily_sent_count: number;
  client_id: number | null;
  warmup_details?: {
    id: number;
    status: string;
    total_sent_count: number;
    total_spam_count: number;
    warmup_reputation: string;
  };
}

export class SmartleadService {
  private config: SmartleadConfig;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://server.smartlead.ai/api/v1'
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const separator = endpoint.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}api_key=${this.config.apiKey}`;

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Smartlead API error: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  }

  // Campaign Methods
  async getAllCampaigns(): Promise<SmartleadCampaign[]> {
    return await this.makeRequest<SmartleadCampaign[]>('/campaigns');
  }

  async getCampaignById(campaignId: number): Promise<SmartleadCampaign> {
    return await this.makeRequest<SmartleadCampaign>(`/campaigns/${campaignId}`);
  }

  async createCampaign(name: string, clientId?: number): Promise<{ ok: boolean; id: number; name: string; created_at: string }> {
    return await this.makeRequest<{ ok: boolean; id: number; name: string; created_at: string }>('/campaigns/create', {
      method: 'POST',
      body: JSON.stringify({ name, client_id: clientId || null }),
    });
  }

  async deleteCampaign(campaignId: number): Promise<{ ok: boolean }> {
    return await this.makeRequest<{ ok: boolean }>(`/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
  }

  // Lead Methods
  async getCampaignLeads(campaignId: number, offset: number = 0, limit: number = 100): Promise<SmartleadLeadStats> {
    return await this.makeRequest<SmartleadLeadStats>(`/campaigns/${campaignId}/leads?offset=${offset}&limit=${limit}`);
  }

  async getLeadByEmail(email: string): Promise<SmartleadLead> {
    return await this.makeRequest<SmartleadLead>(`/leads?email=${encodeURIComponent(email)}`);
  }

  async addLeadsToCampaign(campaignId: number, leads: Partial<SmartleadLead>[]): Promise<{ ok: boolean; result: any }> {
    return await this.makeRequest<{ ok: boolean; result: any }>(`/campaigns/${campaignId}/leads`, {
      method: 'POST',
      body: JSON.stringify({ leads }),
    });
  }

  async updateLead(leadId: number, leadData: Partial<SmartleadLead>): Promise<{ ok: boolean }> {
    return await this.makeRequest<{ ok: boolean }>(`/leads/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify(leadData),
    });
  }

  async deleteLeadFromCampaign(campaignId: number, leadId: number): Promise<{ ok: boolean }> {
    return await this.makeRequest<{ ok: boolean }>(`/campaigns/${campaignId}/leads/${leadId}`, {
      method: 'DELETE',
    });
  }

  // Statistics Methods
  async getCampaignStatistics(
    campaignId: number, 
    offset: number = 0, 
    limit: number = 100, 
    emailStatus?: string, 
    sequenceNumber?: number
  ): Promise<SmartleadCampaignStats> {
    let url = `/campaigns/${campaignId}/statistics?offset=${offset}&limit=${limit}`;
    
    if (emailStatus) {
      url += `&email_status=${emailStatus}`;
    }
    
    if (sequenceNumber) {
      url += `&email_sequence_number=${sequenceNumber}`;
    }

    return await this.makeRequest<SmartleadCampaignStats>(url);
  }

  // Email Account Methods
  async getEmailAccounts(offset: number = 0, limit: number = 100): Promise<SmartleadEmailAccount[]> {
    return await this.makeRequest<SmartleadEmailAccount[]>(`/email-accounts?offset=${offset}&limit=${limit}`);
  }

  async getCampaignEmailAccounts(campaignId: number): Promise<SmartleadEmailAccount[]> {
    return await this.makeRequest<SmartleadEmailAccount[]>(`/campaigns/${campaignId}/email-accounts`);
  }

  // Aggregate Analytics Data
  async getCampaignAnalytics(campaignId: number): Promise<{
    totalLeads: number;
    sentCount: number;
    openCount: number;
    clickCount: number;
    replyCount: number;
    unsubscribeCount: number;
    bounceCount: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
    unsubscribeRate: number;
    bounceRate: number;
  }> {
    const [leadsData, statsData] = await Promise.all([
      this.getCampaignLeads(campaignId, 0, 1000),
      this.getCampaignStatistics(campaignId, 0, 1000)
    ]);

    const totalLeads = leadsData.total_leads;
    const stats = statsData.data;

    const sentCount = stats.filter(s => s.sent_time).length;
    const openCount = stats.reduce((sum, s) => sum + s.open_count, 0);
    const clickCount = stats.reduce((sum, s) => sum + s.click_count, 0);
    const replyCount = stats.reduce((sum, s) => sum + s.reply_count, 0);
    const unsubscribeCount = stats.reduce((sum, s) => sum + s.unsubscribe_count, 0);
    const bounceCount = stats.reduce((sum, s) => sum + s.bounce_count, 0);

    const openRate = sentCount > 0 ? (openCount / sentCount) * 100 : 0;
    const clickRate = sentCount > 0 ? (clickCount / sentCount) * 100 : 0;
    const replyRate = sentCount > 0 ? (replyCount / sentCount) * 100 : 0;
    const unsubscribeRate = sentCount > 0 ? (unsubscribeCount / sentCount) * 100 : 0;
    const bounceRate = sentCount > 0 ? (bounceCount / sentCount) * 100 : 0;

    return {
      totalLeads,
      sentCount,
      openCount,
      clickCount,
      replyCount,
      unsubscribeCount,
      bounceCount,
      openRate,
      clickRate,
      replyRate,
      unsubscribeRate,
      bounceRate
    };
  }

  // Get aggregated analytics for all campaigns
  async getAllCampaignsAnalytics(): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    totalLeads: number;
    totalSent: number;
    totalOpens: number;
    totalClicks: number;
    totalReplies: number;
    avgOpenRate: number;
    avgClickRate: number;
    avgReplyRate: number;
  }> {
    const campaigns = await this.getAllCampaigns();
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
    
    let totalLeads = 0;
    let totalSent = 0;
    let totalOpens = 0;
    let totalClicks = 0;
    let totalReplies = 0;

    // Get analytics for each campaign
    const campaignAnalytics = await Promise.all(
      campaigns.map(async (campaign) => {
        try {
          return await this.getCampaignAnalytics(campaign.id);
        } catch (error) {
          console.error(`Error fetching analytics for campaign ${campaign.id}:`, error);
          return null;
        }
      })
    );

    // Sum up all metrics
    campaignAnalytics.forEach(analytics => {
      if (analytics) {
        totalLeads += analytics.totalLeads;
        totalSent += analytics.sentCount;
        totalOpens += analytics.openCount;
        totalClicks += analytics.clickCount;
        totalReplies += analytics.replyCount;
      }
    });

    const avgOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
    const avgClickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0;
    const avgReplyRate = totalSent > 0 ? (totalReplies / totalSent) * 100 : 0;

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalLeads,
      totalSent,
      totalOpens,
      totalClicks,
      totalReplies,
      avgOpenRate,
      avgClickRate,
      avgReplyRate
    };
  }
}

// Create singleton instance - will be initialized when API key is provided
let smartleadService: SmartleadService | null = null;

export const getSmartleadService = (apiKey?: string): SmartleadService | null => {
  if (apiKey) {
    smartleadService = new SmartleadService(apiKey);
  }
  return smartleadService;
};

export const initializeSmartleadService = (apiKey: string): void => {
  smartleadService = new SmartleadService(apiKey);
};