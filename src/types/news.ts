export type SentimentType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export interface NewsCardData {
  briefingId: string;
  newsId: string;
  ticker: string;
  summary: string[]; // ["줄1", "줄2", "줄3"]
  sentimentTag: SentimentType;
  publishedAt: string;
}

export interface BriefingResponse {
  userId: string;
  cards: NewsCardData[];
}