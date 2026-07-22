import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
const app = initializeApp({
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyC3DfimAVR24O5uNvKgJ_mB0ytrSMt6-Bw",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tt-v2-a0324.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tt-v2-a0324",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "tt-v2-a0324.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "369609302505",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:369609302505:web:087c3791e2aa6b80e2ab78",
});
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
