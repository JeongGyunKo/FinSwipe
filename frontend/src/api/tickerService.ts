import { supabase } from "../lib/supabase";
import type { TickerNameInfo } from "../types/tickers";

export const getUniqueTickersFromNews = async (): Promise<{ symbol: string; name: string; categories: string[] }[]> => {
  //1. 모든 뉴스에서 tickers, categorys 컬럼 가져오기
  const { data, error } = await supabase
    .from('news_articles')
    .select('tickers, categories');

  if (error || !data) return [];

  //2. 가공 로직
  const allTickers = data.flatMap((row) => row.tickers || []);

  //3. 중복 제거 및 정렬
  const uniqueTickers = Array.from(new Set(allTickers)).sort();
  
  //4. StockCard에서 사용할 형식으로 변환
  return uniqueTickers.map((symbol) => ({
    symbol: symbol,
    name: symbol,
    categories: ["technology, markets"], //기본 카테고리 지정
  }));
};

// 관심종목 설정
export const getTickerNames = async (): Promise<TickerNameInfo[]> => {
  const { data, error } = await supabase
    .from('ticker_names')
    .select('ticker, corp, ko')
    .order('ticker', { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    ticker: row.ticker,
    ko: row.ko,
    corp: row.corp,
  }));
};

// 검색
export const searchTickerNames = async (term: string): Promise<TickerNameInfo[]> => {
  const query = supabase
    .from('ticker_names')
    .select('ticker, corp, ko')
    .order('ticker', { ascending: true })
    .limit(100);

  if (term) {
    query.or(`ticker.ilike.%${term}%,ko.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => ({
    ticker: row.ticker,
    ko: row.ko,
    corp: row.corp,
  }));
};