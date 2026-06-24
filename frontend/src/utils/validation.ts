// 1. 아이디 유효성 검사 (8자 이상)
export const validateLoginId = (loginId: string) => {
  return loginId.length >= 8;
};

// 2. 비밀번호 유효성 검사 (8자 이상, 조합 상관없음)
export const validatePassword = (password: string) => {
  if (password.length < 8) return false;
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLowerCase && hasNumber;
};

// 3. 비밀번호 일치 확인
export const validatePasswordMatch = (pw: string, confirm: string) => {
  return pw === confirm && pw !== "";
};

// 4. 이메일 유효성 검사
export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};