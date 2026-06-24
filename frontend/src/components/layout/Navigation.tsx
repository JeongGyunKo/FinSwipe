import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//이미지
import homeOff from '../../assets/ic_home.svg';
import homeOn from '../../assets/ic_home_on.svg';
import quizOff from '../../assets/ic_quiz.svg';
import quizOn from '../../assets/ic_quiz_on.svg';
import likeOff from '../../assets/ic_heart.svg';
import likeOn from '../../assets/ic_heart_on.svg';
import myOff from '../../assets/ic_mypage.svg';
import myOn from '../../assets/ic_mypage_on.svg';

const NAV_ITEMS = [
  { path: "/",       label: "홈",   on: homeOn,   off: homeOff   , activePaths: ["/"] },
  { path: "/quiz", label: "퀴즈", on: quizOn, off: quizOff , activePaths: ["/quiz"]},
  { path: "/like",   label: "관심", on: likeOn,   off: likeOff   , activePaths: ["/like"] },
  { path: "/my",     label: "마이", on: myOn,     off: myOff     , activePaths: ["/my", "/profileEdit", "/settings"] },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showToast, setShowToast] = useState(false);
  
  const handleNavClick = (path: string, comingSoon?: boolean) => {
  if (comingSoon) {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    return;
  }

  if (path === '/') {
    window.dispatchEvent(new Event('homeRefresh'));
  }
  
  navigate(path);
};

  return (
    <div className="fixed bottom-0 z-50 left-1/2 -translate-x-1/2 w-full min-w-80 max-w-107.5 bg-white">
      <nav className="flex items-center justify-around z-50 h-16 px-4 pb-safe border-t border-gray-100">
        {NAV_ITEMS.map(({path, label, on, off, activePaths}) => {
          const isActive = activePaths.includes(location.pathname);
          return (
            <button
              key={path}
              onClick={() => handleNavClick(path)}
              className={`w-12.5 h-12.5 flex items-center justify-center transition-colors ${isActive ? "bg-blue-600/10 rounded-2xl" : ""}`}>
              <img src={isActive? on : off} alt={label} />
            </button>
          );
        })}
      </nav>
      {showToast && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-full shadow-lg whitespace-nowrap">
          추후 개발 예정입니다 🚧
        </div>
      )}
    </div>
  );
};