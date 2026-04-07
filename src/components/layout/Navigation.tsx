import { useNavigate, useLocation } from "react-router-dom";
//이미지
import homeOff from '../../assets/ic_home.svg';
import homeOn from '../../assets/ic_home_on.svg';
import searchOff from '../../assets/ic_search.svg';
import searchOn from '../../assets/ic_search_on.svg';
import likeOff from '../../assets/ic_heart.svg';
import likeOn from '../../assets/ic_heart_on.svg';
import myOff from '../../assets/ic_mypage.svg';
import myOn from '../../assets/ic_mypage_on.svg';

const NAV_ITEMS = [
  { path: "/",       label: "홈",   on: homeOn,   off: homeOff   },
  { path: "/search", label: "검색", on: searchOn, off: searchOff },
  { path: "/like",   label: "관심", on: likeOn,   off: likeOff   },
  { path: "/my",     label: "마이", on: myOn,     off: myOff     },
];

interface NavigationProps {
  showDisclaimer?: boolean; //투자 경고 문구
}

export const Navigation = ({ showDisclaimer = false }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 z-50 left-1/2 -translate-x-1/2 w-full min-w-80 max-w-107.5 bg-white">
      {showDisclaimer && (
        <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-100">
          본 서비스는 투자 참고용 정보를 제공하며, 수익성을 보장하지 않습니다. <br/>
          투자 결정 및 손실에 대한 책임은 투자자 본인에게 있습니다.
        </div>
      )}

      <nav className="flex items-center justify-around z-50 h-16 px-4 pb-safe border-t border-gray-100">
        {NAV_ITEMS.map(({path, label, on, off}) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-12.5 h-12.5 flex items-center justify-center transition-colors ${isActive ? "bg-blue-600/10 rounded-2xl" : ""}`}>
              <img src={isActive? on : off} alt={label} />
            </button>
          );
        })}
      </nav>
    </div>
  );
};