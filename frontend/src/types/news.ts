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
  id: string;               // uuid
  headlineKo: string;       // 제목
  contentPreview: string;   // 원문 300자
  summary: string;          // 전체 요약 텍스트
  summary3linesKo: string[];// jsonb (3줄 요약 배열)
  xaiKo: XaiKo | null;      // 3줄 요약 하이라이트
  sourceUrl: string;        // 원문 링크
  tickers: string[];        // 관련 종목 (배열)
  tickerNames: TickerNameInfo[];
  sentimentLabel: string;   // 감성 라벨
  sentimentScore: number;   // 감성 점수
  sentimentReason: string;  //감성 판단 근거
  publishedAt: string;      // 날짜
  categories: string[];     // 카테고리
  imageUrl: string;         // 썸네일
  is_read: boolean;

  indicators?: {
    type: string;
    value: number | null;
    displayText?: string | null;
    label: string;
    caption: string;
  }[] | null;

  currentPrice?: number | null;      // 현재 주가
  changePct1d?: number | null;       // 전일 대비 등락률
  sparkline?: number[] | null;       // 30일 종가 배열
  eventCategory?: string | null;     // 이벤트 분류 태그
}

//티커별로 데이터 묶기
export interface TickerGroup {
  tickerName: string;
  articles: NewsCardData[];
}

