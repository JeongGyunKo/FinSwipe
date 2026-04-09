import { Link } from "react-router-dom";
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

  // const navigate = useNavigate();

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
            label="이메일"
            placeholder="example@email.com"
            icon={MailIcon}
          />
          <Input
            label="비밀번호"
            isPassword
            placeholder="비밀번호 (8자 이상)"
            icon={PwIcon}
          />
          <div className="flex justify-between">
            <button className="text-base font-medium text-gray-600">이메일 찾기</button>
            <button className="text-base font-medium text-gray-600">비밀번호 찾기</button>
          </div>
          <Button className="mt-10" variant="primary" size="lg">로그인</Button>
          <div className="my-6 flex items-center gap-4">
            <div className="grow h-px bg-gray-200"></div>
            <div className="text-sm text-gray-500">또는</div>
            <div className="grow h-px bg-gray-200"></div>
          </div>
          <div className="flex justify-center">
            <button className="flex items-center justify-center gap-4 w-full h-14 text-base font-semibold text-gray-700 border rounded-xl border-gray-200">
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
      {/* <button onClick={() => navigate('/signUp')}>회원가입</button> */}
    </>
  );
};