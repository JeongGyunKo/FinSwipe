import { useEffect, useState, useMemo } from "react";
import { getUniqueTickersFromNews } from "../api/tickerService";
import type { TickerInfo } from "../types/tickers";
import { StockCard } from "../components/setup/StockCard";
import { Navigation } from "../components/layout/Navigation"
import { Input } from "../components/common/input"
import { Button } from "../components/common/button"
//이미지
import search from "../assets/ic_search.svg";

export const Like = () => {

  const [stocks, setStocks] = useState<TickerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  //페이지 진입 시 티커 리스트 렌더링
  useEffect(() => {    
    const loadTickers = async () => {
      const data = await getUniqueTickersFromNews();
      setStocks(data);
      setLoading(false);
    };

    loadTickers();
  }, []);

  // 검색 필터링
  const filteredStocks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(term) ||
        stock.name.toLowerCase().includes(term)
    );
  }, [searchTerm, stocks]);

  // 종목 선택 Toggle
  const toggleStock = (symbol: string) => {
    setSelectedTickers((prev) =>
      prev.includes(symbol)
      ? prev.filter((t => t !== symbol))
      : [...prev, symbol]
    );
  };

  // 모두 해제
  const clearAll = () => setSelectedTickers([]);

  if (loading) return <div className="p-10 text-center">종목 데이터를 불러오는 중...</div>;
  
  return(
    <>

    {/* 제목, 검색 */}
    <div className="sticky top-0 flex flex-col gap-4 bg-white p-4 pt-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">관심 종목 설정</h1>
        <p className="text-sm text-gray-500">보고 싶은 미국 주식을 선택하세요</p>
      </div>
      <Input 
        placeholder="종목명 또는 티커 검색..."
        icon={search}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">선택된 종목: <span className="font-semibold text-blue-600">{selectedTickers.length}개</span></div>
        <button className="text-sm font-medium text-gray-600">모두 해제</button>
      </div>
    </div>

    {/* 종목 리스트 */}
    <div className="space-y-2 bg-gray-50 p-4 pb-40">
      {filteredStocks.length > 0 ? (
        filteredStocks.map((stock) => (
          <StockCard 
          key={stock.symbol}
          ticker={stock.symbol}
          name={stock.name}
          category={stock.categories}
          isSelected={selectedTickers.includes(stock.symbol)}
          onToggle={() => toggleStock(stock.symbol)}
        />  
        ))
      ): (
        <div className="py-20 text-center text-gray-400">검색 결과가 없습니다.</div>
      )}
     
    </div>

    {/* 하단바 */}
    <div className="fixed bottom-16 z-50 left-1/2 -translate-x-1/2 w-full min-w-80 max-w-107.5 p-4 bg-white border-t border-gray-100">
      <Button variant="primary" disabled={selectedTickers.length === 0}>
        {selectedTickers.length}개 종목 저장하기
      </Button>
    </div>
    <Navigation showDisclaimer={false}/>
    </>
  );
};