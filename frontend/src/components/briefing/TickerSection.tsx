import { useMemo } from "react";
import { CardDeck } from './CardDeck';
import type { NewsCardData } from "../../types/news";

export const TickerSection = ({
  group,
  sortType,
  onVerticalSwipe,
}: {
  group: { tickerName: string; articles: NewsCardData[] };
  sortType: 'time' | 'power';
  onSortUpdate: (method: 'time' | 'power') => void;
  onVerticalSwipe: (direction: 1 | -1) => void;
}) => {
  const sortedArticles = useMemo(() => {
    if (!group.articles || group.articles.length === 0) return [];
    return [...group.articles].sort((a, b) => {
      if (sortType === 'power') {
        return Math.abs(b.sentimentScore || 0) - Math.abs(a.sentimentScore || 0);
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [group.articles, sortType]);

  return (
    <div className="flex flex-col h-full">
      {/* 카드 덱 */}
      <div className="flex-1 min-h-0 pt-2">
        <CardDeck
          articles={sortedArticles}
          groupTicker={group.tickerName}
          onVerticalSwipe={onVerticalSwipe}
        />
      </div>
    </div>
  );
};