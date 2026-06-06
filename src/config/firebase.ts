import { initializeApp } from "firebase/app";
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Firebase configuration object using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth without reCAPTCHA (required for Chrome extensions)
const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
});
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

const firebaseErrors: { [key: string]: string } = {
  // ... existing errors ...
  "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
  "auth/cancelled-popup-request": "The sign-in popup was cancelled.",
  "auth/popup-blocked": "Sign-in popup was blocked by the browser.",
  "auth/account-exists-with-different-credential": 
    "An account already exists with the same email address but different sign-in credentials.",
};

export { app, auth,functions, db, storage };
