// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "dish-dash-11514.firebaseapp.com",
  projectId: "dish-dash-11514",
  storageBucket: "dish-dash-11514.appspot.com",
  messagingSenderId: "318398720224",
  appId: "1:318398720224:web:9ef380f871d54753340885",
  measurementId: "G-ZFV88NTHY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;

if (typeof window !== 'undefined') {
  // Client-side code
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
const auth = getAuth(app);

const db = getFirestore(app)
export {db, analytics, app, auth};