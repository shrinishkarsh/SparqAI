import { apiRequest } from "./queryClient";

export const api = {
  // Auth
  async login(email: string, password: string) {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    return response.json();
  },

  async register(userData: any) {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    return response.json();
  },

  // User
  async getUser(id: number) {
    const response = await apiRequest("GET", `/api/user/${id}`);
    return response.json();
  },

  async updateUser(id: number, updates: any) {
    const response = await apiRequest("PATCH", `/api/user/${id}`, updates);
    return response.json();
  },

  // Company
  async getCompanyByUserId(userId: number) {
    const response = await apiRequest("GET", `/api/company/user/${userId}`);
    return response.json();
  },

  async createCompany(companyData: any) {
    const response = await apiRequest("POST", "/api/company", companyData);
    return response.json();
  },

  async updateCompany(id: number, updates: any) {
    const response = await apiRequest("PATCH", `/api/company/${id}`, updates);
    return response.json();
  },

  // Campaigns
  async getCampaignsByUserId(userId: number) {
    const response = await apiRequest("GET", `/api/campaigns/user/${userId}`);
    return response.json();
  },

  async createCampaign(campaignData: any) {
    const response = await apiRequest("POST", "/api/campaigns", campaignData);
    return response.json();
  },

  async updateCampaign(id: number, updates: any) {
    const response = await apiRequest("PATCH", `/api/campaigns/${id}`, updates);
    return response.json();
  },

  async deleteCampaign(id: number) {
    const response = await apiRequest("DELETE", `/api/campaigns/${id}`);
    return response.json();
  },

  // Contacts
  async getContactsByUserId(userId: number) {
    const response = await apiRequest("GET", `/api/contacts/user/${userId}`);
    return response.json();
  },

  async getContactsByCampaignId(campaignId: number) {
    const response = await apiRequest("GET", `/api/contacts/campaign/${campaignId}`);
    return response.json();
  },

  async createContact(contactData: any) {
    const response = await apiRequest("POST", "/api/contacts", contactData);
    return response.json();
  },

  async updateContact(id: number, updates: any) {
    const response = await apiRequest("PATCH", `/api/contacts/${id}`, updates);
    return response.json();
  },

  // Activities
  async getActivitiesByUserId(userId: number) {
    const response = await apiRequest("GET", `/api/activities/user/${userId}`);
    return response.json();
  },

  async createActivity(activityData: any) {
    const response = await apiRequest("POST", "/api/activities", activityData);
    return response.json();
  },

  // Integrations
  async getIntegrationsByUserId(userId: number) {
    const response = await apiRequest("GET", `/api/integrations/user/${userId}`);
    return response.json();
  },

  async createIntegration(integrationData: any) {
    const response = await apiRequest("POST", "/api/integrations", integrationData);
    return response.json();
  },

  async updateIntegration(id: number, updates: any) {
    const response = await apiRequest("PATCH", `/api/integrations/${id}`, updates);
    return response.json();
  },

  // AI Services
  async enrichLead(email: string, firstName: string, lastName: string, company?: string) {
    const response = await apiRequest("POST", "/api/ai/enrich-lead", {
      email, firstName, lastName, company
    });
    return response.json();
  },

  async generateEmailCopy(data: any) {
    const response = await apiRequest("POST", "/api/ai/generate-email", data);
    return response.json();
  },

  async getAiInsights(campaignData: any, contactData: any) {
    const response = await apiRequest("POST", "/api/ai/insights", {
      campaignData, contactData
    });
    return response.json();
  },

  async generateTargetAudience(companyDescription: string, industry: string) {
    const response = await apiRequest("POST", "/api/ai/target-audience", {
      companyDescription, industry
    });
    return response.json();
  },

  // Dashboard
  async getDashboardStats(userId: number) {
    const response = await apiRequest("GET", `/api/dashboard/stats/${userId}`);
    return response.json();
  },
};
