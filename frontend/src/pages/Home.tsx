import { useEffect, useState, useMemo, useRef } from "react";
import type { NewsCardData } from "../types/news";
import { TickerSection } from "../components/briefing/TickerSection";

// 컴포넌트
import { Header } from "../components/layout/Header"
import { DialMenu } from "../components/layout/DialMenu";

export const Home = () => {
  const [rawData, setRawData] = useState<NewsCardData[]>([]);
  const [userTickers, setUserTickers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState<'time' | 'power'>('time');
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusArticleId, setFocusArticleId] = useState<string | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const deckRef = useRef<HTMLDivElement>(null);
  const wlock = useRef(false);

  const groupedNews = useMemo(() => {
    const safeRawData = rawData || [];

    // 1. 데이터 정렬
    const sortedData = [...safeRawData].sort((a, b) => {
      const aRead = !!a.is_read;
      const bRead = !!b.is_read;
      if (aRead !== bRead) return aRead ? 1 : -1;
      return Math.abs(b.sentimentScore || 0) - Math.abs(a.sentimentScore || 0);
    });

    // 2. 티커별 그룹화 (모든 관심 티커를 빈 배열로 먼저 초기화)
    const groups: { [key: string]: NewsCardData[] } = {};
    userTickers.forEach(ticker => {
      groups[ticker] = [];
    });

    // 3. 기사 분배
    sortedData.forEach((article) => {
      const tickerList = (article.tickers && article.tickers.length > 0) ? article.tickers : ['NULL'];
      tickerList.forEach((t) => {
        if (groups[t] && !groups[t].find(item => item.id === article.id)) {
          groups[t].push(article);
        }
      });
    });

    // 4. 결과 반환 및 정렬
    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        tickerName: name,
        articles: groups[name],
      }));
  }, [rawData, userTickers]);

  const lastFetchTime = useRef(0);

  const fetchInitialData = async (isSilent = false) => {
    const now = Date.now();
    if (now - lastFetchTime.current < 2000) return;
    lastFetchTime.current = now;

    try {
      if (!isSilent) setIsLoading(true);

      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');

      if (!userId || !accessToken) {
        console.error('로그인 정보가 없습니다.');
        if (!isSilent) setIsLoading(false);
        return;
      }

      // 뉴스 + 프로필 동시 호출
      const [newsResponse, profileResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/news/latest?userId=${userId}&limit=50&offset=0`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      if (!newsResponse.ok) throw new Error(`Server Error: ${newsResponse.status}`);
      const json = await newsResponse.json();
      setRawData((json.data ?? []) as NewsCardData[]);
      setUserTickers(json.userTickers ?? []);

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        if (profile.newsSort) setSortType(profile.newsSort);
      }

    } catch (error) {
      console.error('데이터 로드 실패:', error);
      if (!isSilent) setRawData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortUpdate = async (newMethod: 'time' | 'power') => {
    if (sortType === newMethod) return;
    setSortType(newMethod);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/news-sort`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sort: newMethod }),
      });
    } catch (err) {
      console.error("정렬 저장 실패:", err);
    }
  };

  useEffect(() => {
    fetchInitialData(false);

    const handleRefresh = () => { fetchInitialData(true); };
    window.addEventListener('homeRefresh', handleRefresh);

    return () => {
      window.removeEventListener('homeRefresh', handleRefresh);
    };
  }, []);  

  // 다른 페이지에서 특정 뉴스로 진입
  useEffect(() => {
  if (!isLoading && groupedNews.length > 0) {
    const alertArticleStr = sessionStorage.getItem('alertArticle');
      if (alertArticleStr) {
        const article = JSON.parse(alertArticleStr);
        const ticker = article.tickers?.[0];
        if (ticker) {
          const targetIndex = groupedNews.findIndex(g => g.tickerName === ticker);
          if (targetIndex !== -1) setActiveIndex(targetIndex);
        }
        sessionStorage.removeItem('alertArticle');
        setTimeout(() => {
          setFocusArticleId(article.id);
        }, 300);
        return;
      }

      const targetTicker = sessionStorage.getItem('scrollTargetTicker');
      const focusId = sessionStorage.getItem('focusArticleId');

      if (targetTicker) {
        const targetIndex = groupedNews.findIndex(g => g.tickerName === targetTicker);
        if (targetIndex !== -1) setActiveIndex(targetIndex);
        sessionStorage.removeItem('scrollTargetTicker');
      }

      if (focusId) {
        const targetGroup = groupedNews.find(g => 
          g.articles.some(a => a.id === focusId)
        );
        if (targetGroup) {
          const targetIndex = groupedNews.findIndex(g => g.tickerName === targetGroup.tickerName);
          setActiveIndex(targetIndex);
        }
        sessionStorage.removeItem('focusArticleId');
        setTimeout(() => {
          setFocusArticleId(focusId);
        }, 300);
      }
    }
  }, [isLoading, groupedNews]);

  // activeIndex가 범위를 벗어나면 보정
  useEffect(() => {
    if (activeIndex >= groupedNews.length && groupedNews.length > 0) {
      setActiveIndex(groupedNews.length - 1);
    }
  }, [groupedNews, activeIndex]);

  // 티커 전환 애니메이션 (바닐라 JS, translateY + opacity)
  const changeTicker = (dir: 1 | -1) => {
    const newIndex = activeIndex + dir;
    if (newIndex < 0 || newIndex >= groupedNews.length) return;

    const el = deckRef.current;
    if (!el) {
      setActiveIndex(newIndex);
      return;
    }

    el.style.transition = 'transform .18s ease, opacity .18s ease';
    el.style.transform = `translateY(${dir > 0 ? -22 : 22}px)`;
    el.style.opacity = '0';

    setTimeout(() => {
      setActiveIndex(newIndex);
      el.style.transition = 'none';
      el.style.transform = `translateY(${dir > 0 ? 22 : -22}px)`;
      requestAnimationFrame(() => {
        el.style.transition = 'transform .2s ease, opacity .2s ease';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    }, 180);
  };

  // 휠 스크롤로 티커 전환
  const handleWheel = (e: React.WheelEvent) => {
    if (isCardFlipped) return;
    if (Math.abs(e.deltaY) < 16) return;
    if (wlock.current) return;
    wlock.current = true;
    changeTicker(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { wlock.current = false; }, 560);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen font-medium">뉴스를 분류하고 있습니다...</div>;
  }

  const currentGroup = groupedNews[activeIndex];

  return (
    <>
      <Header type="main" />
      <main className="w-full relative">
        {groupedNews.length === 0 ? (
          <div className="flex flex-col justify-center items-center pt-20 space-y-2">
            <p className="text-gray-500 font-semibold text-lg">표시할 뉴스가 없습니다.</p>
          </div>
        ) : (
          <div
            onWheel={handleWheel}
            style={{ height: 'calc(100dvh - 62px)', overflow: 'hidden' }}
          >
            <div ref={deckRef} style={{ height: '100%' }}>
              {currentGroup.articles.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-4">
                  <h3 className="text-2xl font-bold mb-4">{currentGroup.tickerName}</h3>
                  <p className="text-gray-400 text-sm">현재 {currentGroup.tickerName} 관련 뉴스가 없습니다.</p>
                </div>
              ) : (
                <TickerSection
                  key={`${currentGroup.tickerName}-${focusArticleId}`}
                  group={currentGroup}
                  sortType={sortType}
                  onSortUpdate={handleSortUpdate}
                  onVerticalSwipe={changeTicker}
                  focusArticleId={focusArticleId}
                  onFlipChange={setIsCardFlipped}
                />
              )}
            </div>
          </div>
        )}
      </main>
      <DialMenu />
    </>
  );
};