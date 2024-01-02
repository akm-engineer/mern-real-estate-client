// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "mern-estate-10ecc",
  storageBucket: "mern-estate-10ecc.appspot.com",
  messagingSenderId: "934048338183",
  appId: "1:934048338183:web:48f1deb847777d2ffc35a2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
