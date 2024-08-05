// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhbcqkCE0xS6C6IbQKaKm6M8Zl8_KWwEg",
  authDomain: "inventory-management-66b25.firebaseapp.com",
  projectId: "inventory-management-66b25",
  storageBucket: "inventory-management-66b25.appspot.com",
  messagingSenderId: "678306962189",
  appId: "1:678306962189:web:52b9701d63fb84f5d5ee44",
  measurementId: "G-EL9B94Q3M7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }