import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header"
import { Input } from "../components/common/input"
import { Button } from "../components/common/button";
import { validatePassword, validatePasswordMatch } from "../utils/validation";
import pwIcon from "../assets/ic_password.svg";

export const ResetPassword = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isPasswordValid = validatePassword(password);
  const isPasswordMatch = validatePasswordMatch(password, confirmPassword);
  const canSubmit = isPasswordValid && isPasswordMatch && !!token;

  const handleReset = async () => {
    if (!token) return alert("유효하지 않은 접근입니다.");
    if (!canSubmit) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!response.ok) {
        alert("비밀번호 재설정에 실패했습니다. 링크가 만료되었을 수 있습니다.");
        return;
      }

      alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
      navigate("/login");
    } catch (error) {
      console.error("비밀번호 재설정 실패:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header type="sub" title="비밀번호 재설정" />
      <div className="pt-8 px-4 space-y-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-900">새 비밀번호를 입력해주세요</h3>
          <p className="text-base text-gray-500">8자 이상, 영문 소문자+숫자 포함</p>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            label="새 비밀번호"
            icon={pwIcon}
            isPassword
            placeholder="새 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="비밀번호 확인"
            icon={pwIcon}
            isPassword
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button variant="primary" size="md" onClick={handleReset} disabled={!canSubmit}>
          비밀번호 변경
        </Button>
      </div>
    </>
  );
};