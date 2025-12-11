import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT1hg7SNG7UsFJ8osNo0Jr3VsEnAN-AqI",
  authDomain: "ia-avila.firebaseapp.com",
  projectId: "ia-avila",
  storageBucket: "ia-avila.firebasestorage.app",
  messagingSenderId: "557644594558",
  appId: "1:557644594558:web:7f2c1ccaccfb8e8ba6072f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
