import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHRwz7z5OHkbFzH_SlAXFiqh0nS3KFVsw",
  authDomain: "react-user-authenticatio-22c39.firebaseapp.com",
  projectId: "react-user-authenticatio-22c39",
  storageBucket: "react-user-authenticatio-22c39.appspot.com",
  messagingSenderId: "797780836045",
  appId: "1:797780836045:web:963997efa6cc53f5ff7384",
  measurementId: "G-H0YE9PM59G"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
