import { useState, useEffect, type ChangeEvent } from "react";
import { validatePassword, validatePasswordMatch, validateLoginId } from "../utils/validation";
import { supabase } from "../lib/supabase";
//컴포넌트
import { Header } from "../components/layout/Header";
import { Navigation } from "../components/layout/Navigation";
import { Input } from "../components/common/input";
import { Button } from "../components/common/button";
//이미지
import mailIcon from "../assets/ic_email.svg";
import myIcon from "../assets/ic_my.svg";
import pwIcon from "../assets/ic_password.svg";

export const ProfileEdit = () => {

  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    loginId: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [originalLoginId, setOriginalLoginId] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const {data: {session}} = await supabase.auth.getSession();
      if(!session) return;

      setEmail(session.user.email ?? "");

      const { data } = await supabase
        .from("user_profiles")
        .select("login_id, nickname")
        .eq("id", session.user.id)
        .maybeSingle();

        if (data) {
        setFormData(prev => ({ ...prev, loginId: data.login_id, nickname: data.nickname ?? "" }));
        setOriginalLoginId(data.login_id);
        setIsIdChecked(true);
      }
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

    const { data } = await supabase
      .from("user_profiles")
      .select("login_id")
      .eq("login_id", formData.loginId)
      .maybeSingle();

    if (data) {
      alert("이미 사용 중인 아이디입니다.");
      setIsIdChecked(false);
    } else {
      alert("사용 가능한 아이디입니다.");
      setIsIdChecked(true);
    }
  };

  const isPasswordValid = formData.password ? validatePassword(formData.password) : true;
  const isPasswordMatch = formData.password ? validatePasswordMatch(formData.password, formData.confirmPassword) : true;

  const canSubmit = isIdChecked && isPasswordValid && isPasswordMatch;

  const handleSave = async () => {
    if (!canSubmit) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // user_profiles 업데이트
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({ login_id: formData.loginId, nickname: formData.nickname })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      // 비밀번호 입력했을 때만 변경
      if (formData.password) {
        const { error: pwError } = await supabase.auth.updateUser({ password: formData.password });
        if (pwError) throw pwError;
      }

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
        <Input
          label="닉네임(선택)" name="nickname" value={formData.nickname}
          onChange={handleChange} placeholder="사용하실 닉네임을 입력하세요" icon={myIcon}
        />
        <Button onClick={handleSave} disabled={!canSubmit} className="mt-6" variant="primary" size="lg">
          저장하기
        </Button>
      </div>
      <Navigation showDisclaimer={false}/>
    </>
  );
};