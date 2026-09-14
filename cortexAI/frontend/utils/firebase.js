// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "orchestrai-db4a3.firebaseapp.com",
  projectId: "orchestrai-db4a3",
  storageBucket: "orchestrai-db4a3.firebasestorage.app",
  messagingSenderId: "255017448796",
  appId: "1:255017448796:web:993030d47c7caae551bd99",
  measurementId: "G-BRV3RQES3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
