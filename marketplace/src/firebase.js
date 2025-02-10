// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQsMon-FFOA6c6Eem78K_iSWJXqJjOm7Y",
  authDomain: "marketplace-d3f58.firebaseapp.com",
  projectId: "marketplace-d3f58",
  storageBucket: "marketplace-d3f58.firebasestorage.app",
  messagingSenderId: "557846811087",
  appId: "1:557846811087:web:aac48b9af80ff64cf182ba",
  measurementId: "G-N9F99E87LV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de servicios
const auth = getAuth(app); // Servicio de autenticación
const db = getFirestore(app); // Servicio Firestore
const storage = getStorage(app); // Servicio Stora  ge
const googleProvider = new GoogleAuthProvider(); // Proveedor de Google

// Exportar los servicios para usarlos en otras partes del proyecto
export { auth, db, storage, googleProvider };
