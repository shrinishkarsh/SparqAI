export interface DashboardStats {
  totalLeads: number;
  activeCampaigns: number;
  responseRate: number;
  meetingsBooked: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  connections: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
}

export interface AiInsight {
  type: 'optimization' | 'timing' | 'targeting' | 'content';
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  createdAt: Date;
  metadata?: any;
}

export interface CampaignSummary {
  id: number;
  name: string;
  status: string;
  stats: {
    sent: number;
    replied: number;
    meetings: number;
    responseRate: number;
  };
}
