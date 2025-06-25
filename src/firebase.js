// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdLrDjRLzS2XZUdUZuiz4S179e6JQzLPs",
  authDomain: "dsa-tracker-ee6d7.firebaseapp.com",
  projectId: "dsa-tracker-ee6d7",
  storageBucket: "dsa-tracker-ee6d7.appspot.com",
  messagingSenderId: "776461325232",
  appId: "1:776461325232:web:695c2c05bc8251feabbc75",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db, app };
