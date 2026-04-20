// 메인용 (news_articles)
export interface TickerInfo {
  symbol: string
  name: string
  categories: string[];
}

// 관심종목용 (ticker_names)
export interface TickerNameInfo {
  symbol: string
  name: string
  corp: string
}
