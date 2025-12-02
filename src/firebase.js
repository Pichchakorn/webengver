// import { getAnalytics } from "firebase/analytics"; 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, GeoPoint } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCASBLZZz6hS1dBxZFekqLKqjQ8dld0fyQ",
  authDomain: "tonywebprorject.firebaseapp.com",
  projectId: "tonywebprorject",
  storageBucket: "tonywebprorject.firebasestorage.app",
  messagingSenderId: "746026731414",
  appId: "1:746026731414:web:59a6eebb9fbaf157447fb7",
  measurementId: "G-WSENQQZDSL"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { db, auth, GeoPoint, functions };



