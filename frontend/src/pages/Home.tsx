import { useEffect, useState, useRef, useMemo } from "react";
import { trackEvent } from "../lib/analytics/events";
import { SwipeCard } from '../components/briefing/SwipeCard';
import { supabase } from "../lib/supabase";
import type { NewsCardData } from "../types/news";
import type { Swiper as SwiperClass } from 'swiper/types';

// Swiper 라이브러리
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// 컴포넌트
import { Header } from "../components/layout/Header"
import { Navigation } from "../components/layout/Navigation"

export const Home = () => {
  const [rawData, setRawData] = useState<NewsCardData[]>([]);
  const [userTickers, setUserTickers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState<'time' | 'power'>('time');

  const startTimeRef = useRef<number>(Date.now());
  const hasFiredFeedViewed = useRef(false);

  const groupedNews = useMemo(() => {
    if (rawData.length === 0) return [];

    const sortedData = [...rawData].sort((a, b) => {
      // 읽음 상태 비교
      const aRead = !!a.is_read;
      const bRead = !!b.is_read;

      if (aRead !== bRead) {
        return aRead ? 1 : -1;
      }
      
      if (sortType === 'power') {
        return Math.abs(b.sentiment_score || 0) - Math.abs(a.sentiment_score || 0);
      }
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    // 2. 티커별 그룹화 로직
    const groups: { [key: string]: NewsCardData[] } = {};

    sortedData.forEach((article) => {
      const tickerList = (article.tickers && article.tickers.length > 0) ? article.tickers : ['NULL'];

      tickerList.forEach((t) => {
        if (!userTickers.includes(t)) return;
        if (!groups[t]) groups[t] = [];
        if (!groups[t].find(item => item.id === article.id)) {
          groups[t].push(article);
        }
      });
    });

    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        tickerName: name,
        articles: groups[name],
      }));
  }, [rawData, sortType, userTickers]);

  // [B-01] feed_viewed
  useEffect(() => {
    if (!isLoading && groupedNews.length > 0 && !hasFiredFeedViewed.current) {
      trackEvent("feed_viewed", {
        total_decks: groupedNews.length,
        total_tickers: groupedNews.length,
        sort_method: sortType
      });
      hasFiredFeedViewed.current = true;
    }
  }, [isLoading, groupedNews.length, sortType]);

  // 정렬 버튼 핸들러
  const handleSortUpdate = async (newMethod: 'time' | 'power') => {
    if (sortType === newMethod) return;

    setSortType(newMethod);
    trackEvent("feed_sort_changed", { from: sortType, to: newMethod });

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase
        .from("user_profiles")
        .update({ card_sort_order: newMethod === 'time' ? 'latest' : 'power' })
        .eq("id", session.user.id);
    }
  };

  const handleSlideChange = (swiper: SwiperClass, articles: NewsCardData[], groupTicker: string) => {
    const prevIdx = swiper.previousIndex;
    const currentIdx = swiper.activeIndex;
    const swipedCard = articles[prevIdx];

    if (!swipedCard) return;

    const duration = Date.now() - startTimeRef.current;

    trackEvent("card_swiped", {
      news_id: swipedCard.id,
      ticker: groupTicker,
      direction: currentIdx > prevIdx ? "next" : "left",
      time_on_card_ms: duration,
      card_index: prevIdx + 1,
      swipe_method: "gesture",
    });

    if (swiper.isEnd) {
      trackEvent("deck_completed", {
        ticker: groupTicker,
        total_cards: articles.length,
        cards_consumed: articles.length,
        total_time_ms: duration,
        taps_count: 0
      });
    }
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: articles, error: newsError } = await supabase
          .from('news_articles')
          .select('*');
        
        if (newsError) throw newsError;

        const { data: readLogs, error: readError } = await supabase
          .from('user_read_articles')
          .select('article_id')
          .eq('user_id', session.user.id);

        if (readError) throw readError;

        const readIds = new Set(readLogs.map(log => log.article_id));

        const mergedData = articles.map((article: NewsCardData) => ({
          ...article,
          is_read: readIds.has(article.id)
        }));

        setRawData(mergedData);

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("tickers, card_sort_order")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile) {
          setUserTickers(profile.tickers ?? []);
          setSortType(profile.card_sort_order === 'power' ? 'power' : 'time');
        }

      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();

    const handleFocus = () => {
      fetchInitialData(); 
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen font-medium">뉴스를 분류하고 있습니다...</div>;
  }

  return (
    <>
      <Header type="main" />
      <main className="w-full h-full py-6 pb-20 space-y-7 relative">
        <div className="absolute right-4 top-6 flex p-1 rounded-[14px] bg-gray-100 z-10">
          <button 
            onClick={() => handleSortUpdate('time')}
            className={`w-18 h-9 rounded-[10px] font-semibold text-sm transition-all ${
              sortType === 'time' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            최신순
          </button>
          <button 
            onClick={() => handleSortUpdate('power')}
            className={`w-18 h-9 rounded-[10px] font-semibold text-sm transition-all ${
              sortType === 'power' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            파워순
          </button>
        </div>

        {groupedNews.length === 0 ? (
          <div className="flex flex-col justify-center items-center pt-20 space-y-2">
            <p className="text-gray-500 font-semibold text-lg">표시할 뉴스가 없습니다.</p>
          </div>
        ) : (
          groupedNews.map((group) => (
            <section key={group.tickerName} className="space-y-3">
              <div className="flex items-center gap-2 px-4">
                <h3 className="flex items-center px-4 h-10 text-sm font-bold text-blue-600 rounded-full bg-blue-600/10">
                  {group.tickerName}
                </h3>
                <div className={`custom-pagination-${group.tickerName} text-sm font-medium text-gray-500`} />
              </div>

              <Swiper
                key={`${group.tickerName}-${sortType}`} // 정렬 변경 시 Swiper 내부 인덱스 초기화를 위해 key 추가
                onSlideChange={(swiper) => handleSlideChange(swiper, group.articles, group.tickerName)}
                modules={[Pagination, EffectCoverflow]}
                effect={'coverflow'}
                coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 1, scale: 0.9, slideShadows: false }}
                centeredSlides={true}
                slidesPerView={1.1}
                spaceBetween={5}
                grabCursor={true}
                pagination={{ el: `.custom-pagination-${group.tickerName}`, type: 'fraction' }}
              >
                {group.articles.map((article, index) => (
                  <SwiperSlide key={`${group.tickerName}-${article.id}`}>
                    <SwipeCard 
                      data={article} 
                      groupTicker={group.tickerName} 
                      articles={group.articles} 
                      index={index} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          ))
        )}
      </main>
      <Navigation showDisclaimer={true} />
    </>
  );
};