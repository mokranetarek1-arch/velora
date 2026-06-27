import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBxQ4IstdBzERoOVH6Zc6AxxPX4eKo9Y74",
  authDomain: "crmdep.firebaseapp.com",
  projectId: "crmdep",
  storageBucket: "crmdep.firebasestorage.app",
  messagingSenderId: "534291712626",
  appId: "1:534291712626:web:623931a7ed82113f2650eb",
  measurementId: "G-TRCJ0VMQ8K",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((ok) => {
      if (ok) analytics = getAnalytics(app);
    })
    .catch(() => {
      analytics = null;
    });
}

export { app, auth, db, analytics };
