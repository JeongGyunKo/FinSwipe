// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCt3hKjGe3SYbPsgMTxEYUxthIGcck1mLU",
  authDomain: "finswipe-20a3e.firebaseapp.com",
  projectId: "finswipe-20a3e",
  storageBucket: "finswipe-20a3e.firebasestorage.app",
  messagingSenderId: "242459078077",
  appId: "1:242459078077:web:3d4d77d5845d0571b3b6d4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});