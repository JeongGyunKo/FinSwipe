import { useEffect, useState } from "react";
// Swiper 라이브러리
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { SwipeCard } from '../components/briefing/SwipeCard';
import { supabase } from "../lib/supabase";
import type { NewsCardData, TickerGroup } from "../types/news";

//이미지
import upImg from '../assets/ic_up.svg';

export const Home = () => {
  const [groupedNews, setGroupedNews] = useState<TickerGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('news_articles')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;

        const rawData = data as NewsCardData[];

        // 1. 티커별 그룹화
        const groups: { [key: string]: NewsCardData[] } = {};

        rawData.forEach((article) => {          
          const tickerList = (article.tickers && article.tickers.length > 0) // ticker가 null이면 임시 할당
          ? article.tickers 
          : ['NULL'];

          tickerList.forEach((t) => {
            if (!groups[t]) {
              groups[t] = [];
            }
            if (!groups[t].find(item => item.id === article.id)) {
              groups[t].push(article);
            }
          });
        });

        // 2. 객체 → 배열로 변환 및 정렬
        const formattedGroups = Object.keys(groups)
        .map((name) => ({
          tickerName: name,
          articles: groups[name],
        }))
        .sort((a, b) => {          
          if (a.tickerName === 'NULL') return 1; //NULL 맨뒤로
          if (b.tickerName === 'NULL') return -1;
          return a.tickerName.localeCompare(b.tickerName);
        });

        setGroupedNews(formattedGroups);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen font-medium">뉴스를 분류하고 있습니다...</div>;
  }

  if (groupedNews.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-2">
        <p className="text-gray-500 font-semibold text-lg">표시할 뉴스가 없습니다.</p>
        <p className="text-gray-400 text-sm">DB에 데이터가 있는지 확인해 주세요.</p>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-12">
      {groupedNews.map((group) => (
        <section key={group.tickerName} className="space-y-4">

          <div className="flex items-center gap-2">
            <h3 className="flex items-center gap-2 px-4 h-10 text-sm font-bold text-blue-600 rounded-full bg-blue-600/10">
              <img src={upImg} alt="" />{group.tickerName}
            </h3>
            <div className={`custom-pagination-${group.tickerName} text-sm font-medium text-gray-500`} />
          </div>          

          <Swiper
            modules={[Pagination, EffectCoverflow]}
            effect={'coverflow'}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              scale: 0.9,
              slideShadows: false              
            }}
            centeredSlides={true}
            slidesPerView={1.2}
            spaceBetween={10}
            grabCursor={true}
            pagination={{
              el: `.custom-pagination-${group.tickerName}`,
              type: 'fraction'
            }}         
          >
            {group.articles.map((article: NewsCardData) => (
              <SwiperSlide key={`${group.tickerName}-${article.id}`}>
                <SwipeCard data={article} />
              </SwiperSlide>
            ))}
            
          </Swiper>

        </section>
      ))}
    </main>
  );
};