import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validatePasswordMatch, validateLoginId } from "../utils/validation";
import { supabase } from '../lib/supabase';
//컴포넌트
import { Header } from "../components/layout/Header"
import { Input } from "../components/common/input";
import { Button } from "../components/common/button";
import { Checkbox } from "../components/common/checkbox";
import { NoticeBox } from "../components/common/NoticeBox";
// 이미지
import mailIcon from "../assets/ic_email.svg";
import myIcon from "../assets/ic_my.svg";
import pwIcon from "../assets/ic_password.svg";

export const SignUp = () => {
  const navigate = useNavigate();

  // 입력값 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    loginId: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isTermsChecked, setTermsChecked] = useState(false);
  const [isDisclaimerChecked, setDisclaimerChecked] = useState(false);

  // 이메일 중복 검사
  const handleEmailCheck = async () => {
    if (!formData.email) return alert("이메일을 입력해주세요.");
    if (!validateEmail(formData.email)) return alert("이메일 형식이 올바르지 않습니다.");

    const { data } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', formData.email)
      .maybeSingle();

    if (data) {
      alert("이미 가입된 이메일입니다.");
      setIsEmailChecked(false);
    } else {
      alert("사용 가능한 이메일입니다.");
      setIsEmailChecked(true);
    }
  };

  // 아이디 중복 검사
  const handleIdCheck = async () => {
    if (!formData.loginId || !validateLoginId(formData.loginId)) {
      return alert("아이디를 8자 이상 입력해주세요.");
    }

    const { data } = await supabase
      .from('user_profiles')
      .select('login_id')
      .eq('login_id', formData.loginId)
      .maybeSingle();

    if (data) {
      alert("이미 사용 중인 아이디입니다.");
      setIsIdChecked(false);
    } else {
      alert("사용 가능한 아이디입니다.");
      setIsIdChecked(true);
    }
  };

  // 입력 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setIsEmailChecked(false);
    if (name === "loginId") setIsIdChecked(false);
  };

  // 유효성 검사
  const isPasswordValid = validatePassword(formData.password);
  const isPasswordMatch = validatePasswordMatch(formData.password, formData.confirmPassword);
  const isAllChecked = isTermsChecked && isDisclaimerChecked;

  // 최종 가입
  const canSubmit = 
    isEmailChecked &&
    isIdChecked &&
    isPasswordValid && 
    isPasswordMatch &&     
    isAllChecked;

  // 회원가입 실행
  const handleSignUp = async () => {
    if (!canSubmit) return;
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            login_id: formData.loginId,
            nickname: formData.nickname,
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          alert("이미 가입된 이메일입니다. 구글 로그인을 이용해주세요.");
        } else {
          alert(authError.message);
        }
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('user_profiles').insert([{
          id: authData.user.id,
          login_id: formData.loginId,
          email: formData.email,
          nickname: formData.nickname,
          tickers: [],
        }]);

        if (profileError) throw profileError;

        alert(`${formData.email}로 인증 메일이 발송되었습니다.\n메일함을 확인하고 링크를 클릭해주세요.`);
        navigate('/Login');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  //전체 동의 이벤트 핸들러
  const handleAllCheck = (checked:boolean) => {
    setTermsChecked(checked);
    setDisclaimerChecked(checked);
  };

  //투자경고 텍스트 박스
  const noticeBox = [
    "• 본 서비스는 투자 참고용 정보를 제공합니다.",
    "• 제공되는 정보는 수익을 보장하지 않습니다.",
    "• 모든 투자 결정은 본인의 책임 하에 이루어집니다.",
    "• 투자로 인한 손실에 대해 당사는 책임지지 않습니다.",
    "• 투자 전 반드시 충분한 검토가 필요합니다.",
  ];

  return (
    <>
      <Header type="sub" title="회원가입" />
      <div className="px-4 py-6">
        <div className="flex flex-col gap-2.5 mb-8">
          <h3 className="text-2xl font-bold text-gray-900">FinSwipe에 오신 것을 환영합니다</h3>
          <p className="text-basic text-gray-500">간편하게 가입하고 금융 뉴스를 만나보세요</p>
        </div>

        {/* 회원가입 입력폼 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Input 
              label="이메일"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              icon={mailIcon}
              disabled={isEmailChecked}
            />
            <Button variant="outline" size="md" onClick={handleEmailCheck} disabled={isEmailChecked}>
              {isEmailChecked ? "확인 완료" : "중복확인"}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Input 
              label="아이디"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="8자 이상 입력"
              icon={myIcon}
            />          
            <Button variant="outline" size="md" onClick={handleIdCheck} disabled={isIdChecked}>
              {isIdChecked ? "확인 완료" : "중복확인"}
            </Button>
          </div>
          <Input 
            label="비밀번호"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isPassword
            placeholder="8자 이상 입력"
            icon={pwIcon}
          />
          <Input 
            label="비밀번호 확인"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            isPassword
            placeholder="비밀번호를 다시 입력하세요"
            icon={pwIcon}
          />         
          <Input 
            label="닉네임(선택)"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="사용하실 닉네임을 입력하세요"
            icon={myIcon}
          />
        </div>

        {/* 투자 위험 고지 및 동의 */}
        <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-gray-200">
          <Checkbox 
            id="all"
            size="md"
            isBold={true}
            checked={isAllChecked}
            onChange={handleAllCheck}
            label="전체 동의"
          />
          <div className="flex flex-col gap-3 pl-9">
            <Checkbox 
              id="terms"
              size="sm"            
              checked={isTermsChecked}
              onChange={setTermsChecked}
              label={<span>이용약관 동의 <span className="text-blue-600">(필수)</span></span>}
            />
            <Checkbox 
              id="disclaimer"
              size="sm"            
              checked={isDisclaimerChecked}
              onChange={setDisclaimerChecked}
              label={<span>투자 유의사항 동의 <span className="text-blue-600">(필수)</span></span>}
            />
          </div>
          <NoticeBox contents={noticeBox}/>          
        </div>
        <Button 
          onClick={handleSignUp} 
          disabled={!canSubmit}
          className="mt-10 mb-6" variant="primary" size="lg">
            가입하기
        </Button>
        <div className="flex justify-center gap-3 text-gray-600 text-base">
          이미 계정이 있으신가요?
          <Link to="/Login" className="text-blue-600 font-semibold">로그인</Link>
        </div>
      </div>
    </>
  );
};