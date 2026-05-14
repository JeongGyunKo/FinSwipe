import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const getWebPushToken = async () => {
  try {
    // 브라우저가 웹 푸시를 지원하는지 먼저 확인 (사파리 구버전 등 방어)
    const supported = await isSupported();
    if (!supported) {
      console.log("이 브라우저는 웹 푸시를 지원하지 않습니다.");
      return null;
    }

    const messaging = getMessaging(app);    

    const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;
    if (!VAPID_KEY) {
      console.error("VAPID KEY가 로드되지 않았습니다.");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY
    });

    return currentToken;
  } catch (error) {
    console.error("웹 푸시 토큰 발급 에러:", error);
    return null;
  }
};