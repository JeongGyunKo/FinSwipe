//컴포넌트
import { Header } from "../components/layout/Header"
import { Input } from "../components/common/input"
import { Button } from "../components/common/button";
// 이미지
import mailIcon from "../assets/ic_email.svg";

export const FindPassword = () => {

  return (
    <>
      <Header type="sub" title="비밀번호 찾기" />
      <div className="pt-8 px-4 space-y-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-900">비밀번호를 재설정해 드릴게요</h3>
          <p className="text-base text-gray-500">가입한 이메일로 인증번호를 보내드립니다</p>
        </div>
        <Input label="이메일" icon={mailIcon} placeholder="example@email.com"/>
        <Button variant="primary" size="md" disabled>인증번호 받기</Button>
      </div>
    </>
  );
};