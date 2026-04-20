import { useState } from "react";
// 이미지
import showPw from "../../assets/ic_showpw.svg";
import hidePw from "../../assets/ic_hidepw.svg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string; // 왼쪽 아이콘 (이미지 경로)
  isPassword?: boolean; // 비밀번호 여부
}

export const Input = ({ label, icon, isPassword, ...props } : InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 라벨이 있을 경우 렌더링 */}
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}

      <div className="relative group">        
        {icon && (
          <img src={icon} alt="" className="absolute left-4 top-1/2 -translate-y-1/2"/>
        )}

        <input {...props}
          type={isPassword && !showPassword? "password" : "text"}
          className={`w-full h-14.5 pl-12 pr-4 font-basic outline-none border rounded-xl border-gray-200
          focus:border-blue-600
            ${isPassword ? "pr-12" : "pr-4"}`}            
        />
        
        {/* 비밀번호 보기/숨기기 */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <img
              src={showPassword ? hidePw : showPw} 
              alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"} />
          </button>
        )}
      </div>
    </div>
  );
};