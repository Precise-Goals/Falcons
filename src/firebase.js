import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBd9TSxxmheU5D3cIw4ovC9aVusgQrgNog",
  authDomain: "falcons-5cc94.firebaseapp.com",
  projectId: "falcons-5cc94",
  storageBucket: "falcons-5cc94.firebasestorage.app",
  messagingSenderId: "404282222681",
  appId: "1:404282222681:web:7dece9e6f94fa86498a948",
  measurementId: "G-4JEHMG4E8T",
};

// REAL Database location: Singapore (asia-southeast1)

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();