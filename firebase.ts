
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDe9qCVrsfO7MV7le332QvoUIZIE0NUEo4",
  authDomain: "ia-prof-la-methode.firebaseapp.com",
  projectId: "ia-prof-la-methode",
  storageBucket: "ia-prof-la-methode.firebasestorage.app",
  messagingSenderId: "542319629883",
  appId: "1:542319629883:web:dd1c3e9d0f039ee3da6e1e",
  measurementId: "G-27NP00L3HY"
};

// Initialisation unique : on vérifie si l'app existe déjà pour éviter les erreurs de "re-registration"
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
