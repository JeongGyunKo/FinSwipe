import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 px-8 text-center">
      <p className="text-5xl">🧭</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없어요</h1>
        <p className="text-sm text-gray-400">존재하지 않거나 삭제된 페이지예요</p>
      </div>
      <button
        onClick={() => navigate(isLoggedIn ? '/' : '/login')}
        className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl"
      >
        {isLoggedIn ? '홈으로 돌아가기' : '로그인하러 가기'}
      </button>
    </div>
  );
};