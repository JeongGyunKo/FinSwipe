//컴포넌트
import { Header } from "../components/layout/Header"
import { Input } from "../components/common/input"
import { Button } from "../components/common/button";
// 이미지
import tellIcon from "../assets/ic_tell.svg";

export const FindEmail = () => {

  return (
    <>
      <Header type="sub" title="이메일 찾기" />
      <div className="pt-8 px-4 space-y-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-900">가입한 이메일을 찾아드릴게요</h3>
          <p className="text-base text-gray-500">가입 시 등록한 휴대폰 번호를 입력해주세요</p>
        </div>
        <div className="flex flex-col gap-2">
          <Input label="휴대폰 번호" icon={tellIcon} placeholder="01012345678"/>
          <Button variant="outline" size="md" disabled>인증번호 받기</Button>
        </div>
        <Button variant="primary" size="md" disabled>이메일 찾기</Button>
      </div>
    </>
  );
};