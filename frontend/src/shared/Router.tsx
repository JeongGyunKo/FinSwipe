import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePageView } from "../hooks/usePageView.ts";
//라우터
import { Home } from '../pages/Home.tsx';
import { NewsDetail } from "../pages/NewsDetail.tsx";
import { Login } from "../pages/Login.tsx";
import { SignUp } from "../pages/SignUp.tsx";
import { FindEmail } from "../pages/FindEmail.tsx";
import { FindPassword } from "../pages/FindPassword.tsx";
import { ResetPassword } from "../pages/ResetPassword.tsx";
import { Like } from "../pages/Like.tsx";
import { My } from "../pages/My.tsx";
import { ProfileEdit } from "../pages/ProfileEdit.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Quiz } from "../pages/Quiz.tsx";
import { Chat } from "../pages/Chat.tsx";
import { Terms } from "../pages/Terms.tsx";
import { Privacy } from "../pages/Privacy.tsx";
import { NotFound } from "../pages/NotFound.tsx";

const PageViewTracker = () => {
  usePageView();
  return null;
};

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hasTickers, setHasTickers] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');      
      
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
        const response = await fetch(`${API_BASE_URL}/user/tickers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          // 티커가 하나라도 있으면 true, 없으면 false
          setHasTickers(Array.isArray(data.tickers) ? data.tickers.length > 0 : false);
        } else {
          setHasTickers(false);
        }
      } catch (error){
        console.error("관심 종목 설정 여부 확인 실패:", error);
      setHasTickers(false);
      }      
    };

    checkAuth();

    // 로그아웃
    const handleLogout = () => {
      setIsLoggedIn(false);
      setHasTickers(null);
    };

    const handleLogin = () => {
      checkAuth();
    };

    window.addEventListener('logout', handleLogout);
    window.addEventListener('login', handleLogin);
    return () => {
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('login', handleLogin);
    };
  }, []);

  // 로딩 중
  if (isLoggedIn === null) return null;

  return (
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        {/* 로그인 */}
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
        {/* 회원가입 */}
        <Route path="/signUp" element={!isLoggedIn ? <SignUp /> : <Navigate to="/" />} />
        {/* 이메일 찾기 */}
        <Route path="/findEmail" element={<FindEmail />} />
        {/* 비밀번호 찾기 */}
        <Route path="/findPassword" element={<FindPassword />} />
        {/* 비밀번호 초기화 */}
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* 관심 종목 설정 */}
        <Route path="/like" element={isLoggedIn ? <Like /> : <Navigate to="/login" />} />
        {/* 메인 홈 */}
        <Route 
          path="/" 
          element={
            !isLoggedIn 
              ? <Navigate to="/login" /> 
              : hasTickers === false 
                ? <Navigate to="/like" /> 
                : <Home />
          } 
        />        
        {/* 뉴스 상세 */}
        <Route path="/detail/:id" element={isLoggedIn ? <NewsDetail /> : <Navigate to="/login" />} />
        {/* 마이페이지 */}
        <Route path="/my" element={isLoggedIn ? <My /> : <Navigate to="/login" />} />
        {/* 프로필수정 */}
        <Route path="/profileEdit" element={isLoggedIn ? <ProfileEdit /> : <Navigate to="/login" />} />
        {/* 설정 */}
        <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
        {/* 퀴즈 */}
        <Route path="/quiz" element={isLoggedIn ? <Quiz /> : <Navigate to="/login" />} />
        {/* 챗봇 */}
        <Route path="/chat" element={isLoggedIn ? <Chat /> : <Navigate to="/login" />} />
        {/* 이용약관 */}
        <Route path="/terms" element={isLoggedIn ? <Terms /> : <Navigate to="/login" />} />
        {/* 개인정보처리방침 */}
        <Route path="/privacy" element={isLoggedIn ? <Privacy /> : <Navigate to="/login" />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;