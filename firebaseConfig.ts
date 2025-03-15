import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyVoMP3r7cA3QbKQWbe4GxLlLTw1i9mv4",
  authDomain: "motrq-bfb6d.firebaseapp.com",
  projectId: "motrq-bfb6d",
  storageBucket: "motrq-bfb6d.appspot.com", 
  messagingSenderId: "370315550320",
  appId: "1:370315550320:web:0046d618d7eb8985b7deb5",
  measurementId: "G-CPBJ27M5LL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const firestore = getFirestore(app);

export { auth, firestore };
