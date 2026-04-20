import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import { Home } from '../pages/Home';
import { Login } from "../pages/Login.tsx";
import { SignUp } from "../pages/SignUp.tsx";
import { FindEmail } from "../pages/FindEmail.tsx";
import { FindPassword } from "../pages/FindPassword.tsx";
import { Like } from "../pages/Like.tsx";

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hasTickers, setHasTickers] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      // tickers 확인
      const { data } = await supabase
        .from('user_profiles')
        .select('tickers')
        .eq('id', session.user.id)
        .maybeSingle();

      setHasTickers(data?.tickers?.length > 0);
    };

    checkAuth();

    // 로그인 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsLoggedIn(false);
        setHasTickers(null);
      } else {
        setIsLoggedIn(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 로딩 중
  if (isLoggedIn === null) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
        {/* 회원가입 */}
        <Route path="/signUp" element={!isLoggedIn ? <SignUp /> : <Navigate to="/" />} />
        {/* 이메일 찾기 */}
        <Route path="/findEmail" element={<FindEmail />} />
        {/* 비밀번호 찾기 */}
        <Route path="/findPassword" element={<FindPassword />} />
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
      </Routes>
    </BrowserRouter>
  );
};

export default Router;