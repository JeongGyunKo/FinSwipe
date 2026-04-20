//뉴스
export interface NewsCardData {
  id: string;                // uuid
  headline: string;          // 제목
  summary: string;           // 전체 요약 텍스트
  summary_3lines: string[];  // jsonb (3줄 요약 배열)
  source_url: string;        // 원문 링크
  tickers: string[];          // 관련 종목 (배열)
  sentiment_label: string;
  sentiment_score: number;
  published_at: string;      // 날짜
  categories: string[];      // 카테고리
  image_url: string;         // 썸네일
}

//티커별로 데이터 묶기
export interface TickerGroup {
  tickerName: string;
  articles: NewsCardData[];
}