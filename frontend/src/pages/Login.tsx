import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/validation";
import { GoogleLogin } from '@react-oauth/google';
import { getWebPushToken } from '../lib/firebase';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
//컴포넌트
import { Input } from "../components/common/input";
import { Button } from "../components/common/button";
//이미지
import Logo from "../assets/logo.svg";
import LogoTxt from "../assets/logo_tx_white.svg";
import Google from "../assets/ic_google.svg";
import MailIcon from "../assets/ic_email.svg";
import PwIcon from "../assets/ic_password.svg";

export const Login = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    // 빈 값 체크
    if (!identifier.trim() || !password.trim()) {
      alert("이메일/아이디와 비밀번호를 입력해주세요.");
      return;
    }

    if (isLoggingIn) return; // 중복 클릭 방지
    setIsLoggingIn(true);

    try {
      let email = identifier;

      // 이메일 형식이 아니면 아이디로 간주 → 이메일 조회
      if (!validateEmail(identifier)) {
        const response = await fetch(`${API_BASE_URL}/auth/find-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loginId: identifier }),
        });

        if (!response.ok) {
          alert("존재하지 않는 아이디입니다.");
          return;
        }
        const data = await response.json();
        email = data.email;
      }

      // 이메일로 로그인
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        if (loginResponse.status === 401 || loginResponse.status === 400) {
          alert("이메일/아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
          alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        return;
      }

      const loginData = await loginResponse.json();
      localStorage.setItem('accessToken', loginData.access_token);
      localStorage.setItem('userId', loginData.user_id);
      localStorage.setItem('email', loginData.email);
      localStorage.setItem('displayName', loginData.display_name);

      // 푸시 알림 토큰 (실패해도 로그인 흐름은 막지 않음)
      try {
        const check = await FirebaseMessaging.checkPermissions();
        const finalPermission = check.receive;

        if (finalPermission === 'granted') {
          let token = '';

          if (Capacitor.isNativePlatform()) {
            const result = await FirebaseMessaging.getToken();
            token = result.token;
          } else {
            const webToken = await getWebPushToken();
            if (webToken) token = webToken;
          }

          if (token) {
            await fetch(`${API_BASE_URL}/news/device-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${loginData.access_token}`,
              },
              body: JSON.stringify({ token, platform: Capacitor.isNativePlatform() ? 'android' : 'web' }),
            });
          }
        }
      } catch (pushError) {
        console.error("푸시 알림 설정 중 에러 발생:", pushError);
      }

      window.dispatchEvent(new Event('login'));
      navigate('/');

    } catch (error) {
      console.error("로그인 처리 중 에러:", error);
      alert("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google 로그인
  const handleGoogleLogin = async (idToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) throw new Error("서버 인증 실패");

      const data = await response.json();

      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('userId', data.user_id);
      localStorage.setItem('email', data.email);
      localStorage.setItem('displayName', data.display_name);

      window.dispatchEvent(new Event('login'));

      navigate('/');
    } catch (error) {
      console.error("구글 로그인 처리 중 에러:", error);
      alert("로그인에 실패했습니다.");
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
          <Button
            className="mt-10"
            variant="primary"
            size="lg"
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "로그인 중..." : "로그인"}
          </Button>
          <div className="my-6 flex items-center gap-4">
            <div className="grow h-px bg-gray-200"></div>
            <div className="text-sm text-gray-500">또는</div>
            <div className="grow h-px bg-gray-200"></div>
          </div>
          <div className="relative w-full h-14">
            {/* 보이는 커스텀 버튼 */}
            <div className="flex items-center justify-center gap-4 w-full h-14 text-base font-semibold text-gray-700 border rounded-xl border-gray-200 pointer-events-none">
              <img src={Google} alt="" />
              Google 간편 로그인
            </div>
            {/* GoogleLogin을 위에 투명하게 덮음 */}
            <div className="absolute inset-0 opacity-0">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleLogin(credentialResponse.credential);
                  }
                }}
                onError={() => alert("구글 계정 연결에 실패했습니다.")}
                width="500"
              />
            </div>
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