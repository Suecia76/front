import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB9HeyaOAbva49shTzfv3p2J-1WkgmtuHA",
  authDomain: "finz-6a20b.firebaseapp.com",
  projectId: "finz-6a20b",
  storageBucket: "finz-6a20b.appspot.com",
  messagingSenderId: "61987522013",
  appId: "1:61987522013:web:9e7b220746787cd5faa234",
  measurementId: "G-ZC2LSV7N01",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
