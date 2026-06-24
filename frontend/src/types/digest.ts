export interface DigestItem {
  ticker: string;
  articles_count: number;
  sentiment_overview: {
    positive: number;
    negative: number;
    neutral: number;
    avg_score: number;
  };
  summary: string;
  technical_indicators: {
    current_price?: number | null;
    change_pct_1d?: number | null;
    change_pct_1m?: number | null;
    volume_ratio?: number | null;
    RSI?: number | null;
    RSI_signal?: string | null;
    MACD?: {
      macd?: number | null;
      signal?: number | null;
      histogram?: number | null;
      trend?: string | null;
    } | null;
  };
}

export interface DigestResponse {
  digests: DigestItem[];
  user_level: number;
  user_tendency: string;
  generated_at: string;
}