import { createClient } from '@supabase/supabase-js';

// 환경 변수 불러오기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트 생성 및 내보내기
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

//google 로그인
export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({ provider: 'google' })
}

export const signOut = () => {
  return supabase.auth.signOut()
}