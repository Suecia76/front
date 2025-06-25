// --- Firebase Messaging ---
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
  console.log("FCM background message recibido:", payload); // <-- Agrega esto
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/vite.svg",
  });
});

// --- Tu lógica de web-push y caché ---
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", function (event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: "Notificación",
      body: event.data.text(),
    };
  }
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/vite.svg",
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
