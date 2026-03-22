export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  // AI Enrichment
  credibilityScore?: number;
  botLikelihood?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  summary?: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  error?: string;
}

export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface ExplainabilityReport {
  topPositiveFactors: string[];
  topNegativeFactors: string[];
  confidenceDrivers: string[];
  modelDisagreement: number;
  dataFreshness: number;
}

export interface IntelligenceReport {
  credibilityScore: number;
  botLikelihood: number;
  sentiment: Sentiment;
  truthIndex: number;
  truthScore?: number;
  riskScore?: number;
  confidenceScore?: number;
  explainability?: ExplainabilityReport;
  summary: string;
  reasoning: string;
}

export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

export interface SocialResponse {
  data?: Tweet[];
  meta?: {
    result_count: number;
    next_token?: string;
  };
  error?: string;
}
