import { SwipeCard } from '../components/briefing/SwipeCard';
import { MOCK_DATA } from '../constants/mockData';

export const Home = () => {

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <main className="flex-1 w-full flex items-center justify-center px-4">        
        <SwipeCard data={MOCK_DATA.cards[0]} onClick={() => console.log("상세보기")} />
      </main>
    </div>
  );
};