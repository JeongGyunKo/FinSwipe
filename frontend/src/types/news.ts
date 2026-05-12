import type { TickerNameInfo } from './tickers';

//3줄요약 하이라이트
export interface Highlight {
  excerpt: string;
  end_char: number;
  start_char: number;
  explanation: string | null;
  relevance_score: number;
  sentiment_signal: string;
}

export interface XaiKo {
  highlights: Highlight[];
  explanation: string;
}

//뉴스
export interface NewsCardData {
  id: string;                // uuid
  headline_ko: string;          // 제목
  content_preview: string;   // 원문 300자
  summary: string;           // 전체 요약 텍스트
  summary_3lines_ko: string[];  // jsonb (3줄 요약 배열)
  xai_ko: XaiKo | null;      // 3줄 요약 하이라이트
  source_url: string;        // 원문 링크
  tickers: string[];         // 관련 종목 (배열)
  ticker_names: TickerNameInfo[];
  sentiment_label: string;
  sentiment_score: number;
  published_at: string;      // 날짜
  categories: string[];      // 카테고리
  image_url: string;         // 썸네일
  is_read?: boolean;
}

//티커별로 데이터 묶기
export interface TickerGroup {
  tickerName: string;
  articles: NewsCardData[];
}

