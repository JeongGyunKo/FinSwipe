import { useEffect } from "react";
// import { initGA } from "./lib/analytics/config";
import Router from './shared/Router';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import './lib/firebase';


function App() {

  useEffect(() => {
    //initGA();
    
    const initPush = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const check = await FirebaseMessaging.checkPermissions();
          
          if (check.receive === 'granted') {
          const { token } = await FirebaseMessaging.getToken();

          const accessToken = localStorage.getItem('accessToken');
          const userId = localStorage.getItem('userId');
          if (!accessToken || !userId) return;

          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          await fetch(`${API_BASE_URL}/news/device-token?user_id=${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ token }),
          });
        }
        } catch (error) {
          console.error('푸시 초기화 실패:', error);
        }
      };
    }
      
    initPush();
  }, []);

  return (
    <div className="min-h-screen flex justify-center">
      <div className='w-full min-w-80 max-w-107.5 bg-white relative'>
        <Router />
      </div>
    </div>
  );
}

export default App;

