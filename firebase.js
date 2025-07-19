// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY29fuzgXpDqu2nMi6dA2GfHgVJab3XJg",
  authDomain: "paisapani-461cc.firebaseapp.com",
  projectId: "paisapani-461cc",
  storageBucket: "paisapani-461cc.firebasestorage.app",
  messagingSenderId: "69189951045",
  appId: "1:69189951045:web:628ae686c23a9fef93cd2c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the initialized app so you can use it elsewhere
export default app;