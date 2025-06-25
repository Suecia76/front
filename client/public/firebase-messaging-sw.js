importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB9HeyaOAbva49shTzfv3p2J-1WkgmtuHA",
  authDomain: "finz-6a20b.firebaseapp.com",
  projectId: "finz-6a20b",
  storageBucket: "finz-6a20b.appspot.com",
  messagingSenderId: "61987522013",
  appId: "1:61987522013:web:9e7b220746787cd5faa234",
  measurementId: "G-ZC2LSV7N01",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/vite.svg",
  });
});
