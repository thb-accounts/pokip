import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC3DfimAVR24O5uNvKgJ_mB0ytrSMt6-Bw",
  authDomain: "tt-v2-a0324.firebaseapp.com",
  projectId: "tt-v2-a0324",
  storageBucket: "tt-v2-a0324.firebasestorage.app",
  messagingSenderId: "369609302505",
  appId: "1:369609302505:web:087c3791e2aa6b80e2ab78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);