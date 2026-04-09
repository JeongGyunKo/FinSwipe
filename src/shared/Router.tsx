import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from '../pages/Home';
import { Login } from "../pages/Login.tsx";
import { SignUp } from "../pages/SignUp.tsx";
import { FindEmail } from "../pages/FindEmail.tsx";
import { FindPassword } from "../pages/FindPassword.tsx";
import { Like } from "../pages/Like.tsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/login" element={<Login />} />
        {/* 회원가입 */}
        <Route path="/signUp" element={<SignUp />} />
        {/* 이메일 찾기 */}
        <Route path="/findEmail" element={<FindEmail />} />
        {/* 비밀번호 찾기 */}
        <Route path="/findPassword" element={<FindPassword />} />
        {/* 관심 종목 설정 */}
        <Route path="/like" element={<Like />} />
        {/* 메인 홈 */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;