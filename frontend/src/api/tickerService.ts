import { supabase } from "../lib/supabase";
import type { TickerNameInfo } from "../types/tickers";

export const getUniqueTickersFromNews = async (): Promise<{ symbol: string; name: string; categories: string[] }[]> => {
  try {
    // 백엔드 API 호출
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/news/tickers`);
    const json = await res.json();
    
    const data = json.data; 

    if (!data || !Array.isArray(data)) return [];

    // StockCard에서 사용할 형식으로 변환 및 정렬
    return data.sort().map((symbol: string) => ({
      symbol: symbol,
      name: symbol,
      categories: ["technology", "markets"], 
    }));
  } catch (error) {
    console.error("티커 목록 로드 실패:", error);
    return [];
  }
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