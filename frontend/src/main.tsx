//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from "virtual:pwa-register";
import { GoogleOAuthProvider } from '@react-oauth/google';

registerSW({
  onNeedRefresh() {
    console.log("새 버전이 있습니다.");
  },
  onOfflineReady() {
    console.log("오프라인 사용 준비 완료");
  }
});

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  //<StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  //</StrictMode>,
)
