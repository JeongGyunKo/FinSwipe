import { useState } from "react";
import { Header } from "../components/layout/Header"
import { Input } from "../components/common/input"
import { Button } from "../components/common/button";
import { validateEmail } from "../utils/validation";
import mailIcon from "../assets/ic_email.svg";

export const FindPassword = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSendEmail = async () => {
    if (!email) return alert("이메일을 입력해주세요.");
    if (!validateEmail(email)) return alert("이메일 형식이 올바르지 않습니다.");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "이메일 발송에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setIsSent(true);
      alert(`${email}로 비밀번호 재설정 링크를 발송했습니다.\n메일함을 확인해주세요.`);
    } catch (error) {
      console.error("비밀번호 재설정 요청 실패:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };
  
  return (
    <>
      <Header type="sub" title="비밀번호 찾기" />
      <div className="pt-8 px-4 space-y-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-900">비밀번호를 재설정해 드릴게요</h3>
          <p className="text-base text-gray-500">가입한 이메일로 인증번호를 보내드립니다</p>
        </div>
        <Input
          label="이메일"
          icon={mailIcon}
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSent}
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleSendEmail}
          disabled={!email || isSent}
        >
          {isSent ? "발송 완료" : "인증번호 받기"}
        </Button>
      </div>
    </>
  );
};