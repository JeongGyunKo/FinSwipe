//출처 URL 도메인 이름만 추출
export const getSourceName = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};