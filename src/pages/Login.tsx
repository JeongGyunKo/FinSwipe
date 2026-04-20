import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, signInWithGoogle } from '../lib/supabase';
import { validateEmail } from "../utils/validation";
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("비밀번호가 올바르지 않습니다.");
    } else {
      navigate('/'); // 메인으로 이동
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
            <button onClick={() => signInWithGoogle()}
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