// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc9WsGP6tnz911RbxNWZwAhGm8GiLKOqM",
  authDomain: "cookbook-4a3ad.firebaseapp.com",
  projectId: "cookbook-4a3ad",
  storageBucket: "cookbook-4a3ad.firebasestorage.app",
  messagingSenderId: "624230136310",
  appId: "1:624230136310:web:c1ea06ce43b3e2a8862fd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)