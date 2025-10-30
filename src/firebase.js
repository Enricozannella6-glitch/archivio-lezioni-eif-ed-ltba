// Importa le funzioni di Firebase (versione web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// Configurazione della tua app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBbsDWoIMPTSC04FHAnpvxbrigz2SWrqxs",
  authDomain: "archivio-lezioni-ltba-eif.firebaseapp.com",
  projectId: "archivio-lezioni-ltba-eif",
  storageBucket: "archivio-lezioni-ltba-eif.firebasestorage.app",
  messagingSenderId: "1034300444621",
  appId: "1:1034300444621:web:311ab69d7b11c6f65a7e84"
};

// Inizializza Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log("✅ Firebase connesso correttamente!");
