import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-placeholder"
});

export interface LeadEnrichmentData {
  company: string;
  industry: string;
  companySize: string;
  revenue: string;
  technologies: string[];
  recentNews: string[];
  fundingInfo?: string;
  socialMediaPresence: {
    linkedin: string;
    twitter?: string;
    website: string;
  };
}

export interface EmailCopyRequest {
  recipientName: string;
  recipientTitle: string;
  company: string;
  industry: string;
  campaignType: string;
  tone: 'professional' | 'casual' | 'friendly';
  objective: string;
  personalizedInsight?: string;
}

export interface EmailCopyResponse {
  subject: string;
  body: string;
  followUpSuggestions: string[];
}

export interface AiInsight {
  type: 'optimization' | 'timing' | 'targeting' | 'content';
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

export class OpenAIService {
  
  async enrichLead(email: string, firstName: string, lastName: string, company?: string): Promise<LeadEnrichmentData | null> {
    try {
      const prompt = `
        Please enrich the following lead information and provide detailed company and contact data:
        
        Name: ${firstName} ${lastName}
        Email: ${email}
        ${company ? `Company: ${company}` : ''}
        
        Please provide enrichment data in JSON format with the following structure:
        {
          "company": "Company Name",
          "industry": "Industry",
          "companySize": "Employee count range",
          "revenue": "Revenue range",
          "technologies": ["tech1", "tech2"],
          "recentNews": ["news1", "news2"],
          "fundingInfo": "Recent funding information if available",
          "socialMediaPresence": {
            "linkedin": "linkedin-url",
            "twitter": "twitter-url",
            "website": "website-url"
          }
        }
        
        If you cannot find real information, return null.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a lead enrichment expert. Only provide real, verifiable information about companies and contacts. If you cannot find accurate information, return null."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.company ? result : null;
    } catch (error) {
      console.error('Lead enrichment failed:', error);
      return null;
    }
  }

  async generateEmailCopy(request: EmailCopyRequest): Promise<EmailCopyResponse> {
    try {
      const prompt = `
        Generate a personalized email for the following campaign:
        
        Recipient: ${request.recipientName} (${request.recipientTitle})
        Company: ${request.company}
        Industry: ${request.industry}
        Campaign Type: ${request.campaignType}
        Tone: ${request.tone}
        Objective: ${request.objective}
        ${request.personalizedInsight ? `Personalized Insight: ${request.personalizedInsight}` : ''}
        
        Please create an email that:
        1. Has a compelling subject line
        2. Is personalized and relevant
        3. Clearly communicates value
        4. Has a clear call-to-action
        5. Matches the specified tone
        
        Respond in JSON format:
        {
          "subject": "Email subject line",
          "body": "Email body content",
          "followUpSuggestions": ["suggestion1", "suggestion2", "suggestion3"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert sales copywriter specializing in B2B outreach. Create compelling, personalized emails that drive responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Email copy generation failed:', error);
      throw new Error('Failed to generate email copy');
    }
  }

  async generateAiInsights(campaignData: any, contactData: any[]): Promise<AiInsight[]> {
    try {
      const prompt = `
        Analyze the following campaign and contact data to provide AI-powered insights:
        
        Campaign Data: ${JSON.stringify(campaignData)}
        Contact Data: ${JSON.stringify(contactData.slice(0, 10))} // Limit data size
        
        Please provide 3-5 actionable insights that could help improve campaign performance.
        
        Respond in JSON format:
        {
          "insights": [
            {
              "type": "optimization|timing|targeting|content",
              "title": "Insight title",
              "description": "Detailed description",
              "recommendation": "Specific recommendation",
              "impact": "high|medium|low",
              "confidence": 0.85
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI sales performance analyst. Provide data-driven insights to optimize sales campaigns."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.insights || [];
    } catch (error) {
      console.error('AI insights generation failed:', error);
      return [];
    }
  }

  async generateTargetAudience(companyDescription: string, industry: string): Promise<string[]> {
    try {
      const prompt = `
        Based on the following company information, suggest ideal target audience segments:
        
        Company Description: ${companyDescription}
        Industry: ${industry}
        
        Please provide 5-7 specific target audience segments with job titles and descriptions.
        
        Respond in JSON format:
        {
          "audiences": [
            "Job Title 1 - Description",
            "Job Title 2 - Description"
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a B2B marketing expert. Suggest precise target audiences for sales campaigns."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.audiences || [];
    } catch (error) {
      console.error('Target audience generation failed:', error);
      return [];
    }
  }
}

export const openaiService = new OpenAIService();
