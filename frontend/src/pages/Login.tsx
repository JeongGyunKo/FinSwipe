import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabase';
import { validateEmail } from "../utils/validation";
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';

//컴포넌트
import { Input } from "../components/common/input";
import { Button } from "../components/common/button";
//이미지
import Logo from "../assets/logo.svg";
import LogoTxt from "../assets/logo_tx_white.svg";
import MailIcon from "../assets/ic_email.svg";
import PwIcon from "../assets/ic_password.svg";
import Google from "../assets/ic_google.svg";

export const Login = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // 이메일 또는 아이디
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) return alert("이메일/아이디와 비밀번호를 입력해주세요.");

    let email = identifier;

    // 이메일 형식이 아니면 아이디로 간주 → 이메일 조회
    if (!validateEmail(identifier)) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('login_id', identifier)
        .maybeSingle();

      if (error || !data) return alert("존재하지 않는 아이디입니다.");
      email = data.email;
    }

    // 이메일로 로그인
    const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      alert("비밀번호가 올바르지 않습니다.");
    } else {
      // --- 푸시 알림 토큰 발급 및 저장 로직 ---
      try {
        const check = await FirebaseMessaging.checkPermissions();
        let finalPermission = check.receive;

        // 알림 권한을 물어본 적이 없다면 팝업 호출
        if (finalPermission === 'prompt') {
          const permission = await FirebaseMessaging.requestPermissions();
          finalPermission = permission.receive;
        }

        // 권한이 허용된 상태라면 토큰 발급 후 백엔드 전송
        if (finalPermission === 'granted') {
          const { token } = await FirebaseMessaging.getToken();
          
          if (authData.user) {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/news/device-token?user_id=${authData.user.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });

            if (!response.ok) {
              console.error(`기기 토큰 저장 실패. 서버 상태 코드: ${response.status}`);
            }
          }
        } else {
          console.log("알림 권한이 거부되어 토큰을 저장하지 않습니다.");
        }
      } catch (err) {
        console.error("푸시 알림 설정 중 에러 발생:", err);
      }
      
      // 모든 처리가 완료되면 메인으로 이동
      navigate('/'); 
    }
  };

  // Google 로그인 분기처리
  const handleGoogleLogin = async () => {
    const redirectTo = Capacitor.isNativePlatform()
    ? 'com.finswipe.app://login-callback' // App 유저는 딥링크 앱으로 복귀
    : 'https://fin-swipe.vercel.app/'; // Web 유저는 웹사이트로 복귀

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
      },
    });

    if (error) {
      console.error("구글 로그인 에러:", error.message);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-6 py-16 bg-[linear-gradient(180deg,rgba(0,100,255,1)_0%,rgba(0,82,204,1)_100%)]">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="" />
          <img src={LogoTxt} alt="" />
        </div>
        <p className="text-lg text-white opacity-90">금융 뉴스를 스마트하게</p>
      </div>

      <div className="relative space-y-8 -mt-6 pt-8 px-4 bg-white rounded-t-3xl">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-gray-900">로그인</h3>
          <p className="text-base text-gray-500">계정에 로그인하여 시작하세요</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input 
            label="이메일/아이디"
            placeholder="example@email.com"
            icon={MailIcon}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <Input
            label="비밀번호"
            isPassword
            placeholder="비밀번호 (8자 이상)"
            icon={PwIcon}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between">
            <Link to="/FindEmail" className="text-base font-medium text-gray-600">이메일/아이디 찾기</Link>
            <Link to="/FindPassword" className="text-base font-medium text-gray-600">비밀번호 찾기</Link>
          </div>
          <Button className="mt-10" variant="primary" size="lg" onClick={handleLogin}>로그인</Button>
          <div className="my-6 flex items-center gap-4">
            <div className="grow h-px bg-gray-200"></div>
            <div className="text-sm text-gray-500">또는</div>
            <div className="grow h-px bg-gray-200"></div>
          </div>
          <div className="flex justify-center">
            <button onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-4 w-full h-14 text-base font-semibold text-gray-700 border rounded-xl border-gray-200">
              <img src={Google} alt="" />
              Google 간편 로그인
            </button>
          </div>          
        </div>
        <div className="flex justify-center items-center text-base text-gray-600 gap-2">
          계정이 없으신가요?
          <Link to="/signUp" className="text-base text-blue-600 font-semibold">회원가입</Link>
        </div>
      </div>
    </>
  );
};