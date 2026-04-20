export const getTimeAgo = (dateString: string) => {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000 / 60);
  
  if (diff < 1) return '방금 전';
  if (diff < 60) return `${diff}분 전`;
  if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 60 / 24)}일 전`;
};