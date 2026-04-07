import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from '../pages/Home';
import { Login } from "../pages/Login.tsx";
import { SignUp } from "../pages/SignUp.tsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/login" element={<Login />} />
        {/* 회원가입 */}
        <Route path="/signUp" element={<SignUp />} />
        {/* 메인 홈 */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;