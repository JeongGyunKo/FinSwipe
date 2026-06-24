import { useState, useEffect, type ChangeEvent } from "react";
import { validatePassword, validatePasswordMatch, validateLoginId } from "../utils/validation";
//컴포넌트
import { Header } from "../components/layout/Header";
import { DialMenu } from "../components/layout/DialMenu";
import { Input } from "../components/common/input";
import { Button } from "../components/common/button";
//이미지
import mailIcon from "../assets/ic_email.svg";
import myIcon from "../assets/ic_my.svg";
import pwIcon from "../assets/ic_password.svg";

export const ProfileEdit = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [authProvider, setAuthProvider] = useState<"google" | "email" | null>(null);
  const [formData, setFormData] = useState({
    loginId: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [originalLoginId, setOriginalLoginId] = useState("");

   useEffect(() => {
    const loadProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      console.log("프로필 응답:", data);

      // 받아온 데이터로 state 세팅
      setEmail(data.email);
      setAuthProvider(data.authProvider);
      setFormData(prev => ({
        ...prev,
        loginId: data.loginId ?? "",
        displayName: data.displayName ?? "",
      }));
      setOriginalLoginId(data.loginId ?? "");
    };
    loadProfile();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "loginId") setIsIdChecked(false);
  };

  const handleIdCheck = async () => {
    if (!validateLoginId(formData.loginId)) return alert("아이디를 8자 이상 입력해주세요.");

    // 기존 아이디랑 같으면 통과
    if (formData.loginId === originalLoginId) {
      setIsIdChecked(true);
      return alert("현재 사용 중인 아이디입니다.");
    }

    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(
      `${API_BASE_URL}/auth/check-login-id?loginId=${formData.loginId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await response.json();
    console.log("중복확인 응답:", data);

    if (data.available) {
      alert("사용 가능한 아이디입니다.");
      setIsIdChecked(true);
    } else {
      alert("이미 사용 중인 아이디입니다.");
      setIsIdChecked(false);
    }
  };

  const isPasswordValid = formData.password ? validatePassword(formData.password) : true;
  const isPasswordMatch = formData.password ? validatePasswordMatch(formData.password, formData.confirmPassword) : true;

  const canSubmit = authProvider === "google" 
  ? true 
  : isIdChecked && isPasswordValid && isPasswordMatch;

  const handleSave = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      // 구글 유저: displayName만
      // 이메일 유저: displayName + loginId + password
      const body: Record<string, string> = {
        displayName: formData.displayName,
      };

      if (authProvider === "email") {
        if (!isIdChecked) return alert("아이디 중복확인을 해주세요.");
        if (!isPasswordValid) return alert("비밀번호를 확인해주세요.");
        if (!isPasswordMatch) return alert("비밀번호가 일치하지 않습니다.");
        
        body.loginId = formData.loginId;
        if (formData.password) body.password = formData.password;
      }

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("저장 실패");
      alert("저장되었습니다.");
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return (
    <>
      <Header type="sub" title="내정보 수정" />
      <div className="px-4 py-6 pb-32 space-y-4">
        <div className="flex flex-col gap-2">
          <Input label="이메일" value={email} icon={mailIcon} disabled onChange={() => {}} />
          <p className="text-xs text-gray-400 px-1">이메일은 변경할 수 없습니다</p>
        </div>
        {authProvider === "email" && (
          <>
          <div className="flex flex-col gap-2">
            <Input
              label="아이디" name="loginId" value={formData.loginId}
              onChange={handleChange} placeholder="8자 이상 입력" icon={myIcon}
            />
            <Button variant="outline" size="md" onClick={handleIdCheck} disabled={isIdChecked}>
              {isIdChecked ? "확인 완료" : "중복확인"}
            </Button>
          </div>
          <Input
            label="비밀번호" name="password" value={formData.password}
            onChange={handleChange} isPassword placeholder="비밀번호 (8자 이상)" icon={pwIcon}
          />
          <Input
            label="비밀번호 확인" name="confirmPassword" value={formData.confirmPassword}
            onChange={handleChange} isPassword placeholder="비밀번호를 다시 입력하세요" icon={pwIcon}
          />
          </>
        )}        
        <Input
          label="닉네임(선택)" name="displayName" value={formData.displayName}
          onChange={handleChange} placeholder="사용하실 닉네임을 입력하세요" icon={myIcon}
        />
        <Button onClick={handleSave} disabled={!canSubmit} className="mt-6" variant="primary" size="lg">
          저장하기
        </Button>
      </div>
      <DialMenu />
    </>
  );
};