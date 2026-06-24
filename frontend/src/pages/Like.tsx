import { useEffect, useState } from "react";
import { searchTickerNames } from "../api/tickerService";
import { useNavigate } from "react-router-dom";
import type { TickerNameInfo } from "../types/tickers";
import { StockCard } from "../components/setup/StockCard";
import { DialMenu } from "../components/layout/DialMenu";
import { Input } from "../components/common/input"
import { Button } from "../components/common/button"
//이미지
import search from "../assets/ic_search.svg";

export const Like = () => {
  
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<TickerNameInfo[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const loadInitial = async () => {
      const token = localStorage.getItem('accessToken');
      const allStocks = await searchTickerNames(""); // 한 번만 호출

      if (!token) {
        setStocks(allStocks);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user/tickers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const tickers = Array.isArray(data.tickers) ? data.tickers : [];
          setSelectedTickers(tickers);
          if (tickers.length === 0) setIsFirstTime(true);

          const sorted = [
            ...allStocks.filter(s => tickers.includes(s.ticker)),
            ...allStocks.filter(s => !tickers.includes(s.ticker)).slice(0, 50),
          ];
          setStocks(sorted);
        }
      } catch (error) {
        console.error("관심 티커 불러오기 실패:", error);
        setStocks(allStocks);
      }
    };
    loadInitial();
  }, []);

  // 검색어 바뀔때마다 검색
  useEffect(() => {    
    const search = async () => {
      const data = await searchTickerNames(searchTerm);
      setStocks(data);
    };
    search();
  }, [searchTerm]);

  

  // 종목 선택 Toggle
  const toggleStock = (ticker: string) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker)
      ? prev.filter((t => t !== ticker))
      : [...prev, ticker]
    );
  };

  // 모두 해제
  const clearAll = () => setSelectedTickers([]);

  //데이터 저장
  const handleSave = async () => {    
    const token = localStorage.getItem('accessToken');
    console.log('handleSave token:', token);
    if(!token) return alert("로그인이 필요합니다.");    

    try {
      const response = await fetch(`${API_BASE_URL}/user/tickers`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tickers: selectedTickers }),
      });

      if (!response.ok) throw new Error("저장 실패");

      alert("관심 종목이 저장되었습니다.");
      setTimeout(() => {
        navigate(isFirstTime ? "/quiz" : "/", { replace: true });
      }, 100);
    } catch (error) {
      console.error("관심 티커 저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };  
  
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
        <button onClick={clearAll} className="text-sm font-medium text-gray-600">모두 해제</button>
      </div>
    </div>

    {/* 종목 리스트 */}
    <div className="space-y-2 bg-gray-50 p-4 pb-40">
      {stocks.length > 0 ? (
        stocks.map((stock) => (
          <StockCard 
          key={stock.ticker}
          ticker={stock.ticker}
          name={stock.ko}
          corp={stock.corp}
          isSelected={selectedTickers.includes(stock.ticker)}
          onToggle={() => toggleStock(stock.ticker)}
        />  
        ))
      ): (
        <div className="py-20 text-center text-gray-400">
          {searchTerm ? "검색 결과가 없습니다." : "종목명 또는 티커를 검색해주세요."}
        </div>
      )}     
    </div>

    {/* 하단바 */}
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full min-w-80 max-w-107.5 p-4 bg-white border-t border-gray-100">
      <Button variant="primary" disabled={selectedTickers.length === 0} onClick={handleSave}>
        {selectedTickers.length}개 종목 저장하기
      </Button>
    </div>
    <DialMenu />
    </>
  );
};