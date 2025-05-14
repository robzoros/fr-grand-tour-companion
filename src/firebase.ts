import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔁 Reemplaza estos valores con los de tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDz4gffFuNPu_o2Kx8IKqxshGLOzqiZpgg",
  authDomain: "fr-grand-peloton-companion.firebaseapp.com",
  projectId: "fr-grand-peloton-companion",
  storageBucket: "fr-grand-peloton-companion.firebasestorage.app",
  messagingSenderId: "419328532550",
  appId: "1:419328532550:web:c28f4b17a90aff49e8ea47",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
