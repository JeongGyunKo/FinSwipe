// 개인정보 자동 차단
export const sanitizeParams = (params: any) => {
  if (!params) return {};
  
  // 차단 키워드 리스트
  const forbiddenKeys = ['email', 'name', 'phone', 'password', 'address', 'birth', 'ssn', 'card_number', 'account'];
  const sanitized = { ...params };

  Object.keys(sanitized).forEach((key) => {
    // 1. 키 이름 검사
    if (forbiddenKeys.some(k => key.toLowerCase().includes(k))) {
      delete sanitized[key];
    }
    // 2. 값의 길이 제한 (100자 초과 시 절삭)
    if (typeof sanitized[key] === 'string' && sanitized[key].length > 100) {
      sanitized[key] = sanitized[key].substring(0, 100);
    }
  });
  
  return sanitized;
};