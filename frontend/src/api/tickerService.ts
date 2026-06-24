import type { TickerNameInfo } from "../types/tickers";

let tickerCache: TickerNameInfo[] | null = null;

export const searchTickerNames = async (term: string): Promise<TickerNameInfo[]> => {
  try {
    // 캐시 없을 때만 API 호출
    if (!tickerCache) {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/news/tickers`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json();
      tickerCache = json.data ?? [];
    }

    const filtered = term
      ? tickerCache!.filter((item) =>
          item.ticker.toLowerCase().includes(term.toLowerCase()) ||
          item.ko.includes(term) ||
          item.corp.toLowerCase().includes(term.toLowerCase())
        )
      : tickerCache!;

    return filtered.sort((a, b) => a.ticker.localeCompare(b.ticker));
  } catch (error) {
    console.error("티커 검색 실패:", error);
    return [];
  }
};

