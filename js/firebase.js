// 1. Las importaciones SIEMPRE van hasta arriba en un módulo
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue } from "firebase/database";

console.log("¡Hola! Firebase.js está cargando correctamente.");
console.log("ID del proyecto Vite:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
// 2. Configuración
const firebaseConfig = {
  apiKey: "AIzaSyCWiHiI5nnMjMU7r-x8H3oCFaqVI0hlA7s",
  authDomain: "landing-ce40b.firebaseapp.com",
  databaseURL: "https://landing-ce40b-default-rtdb.firebaseio.com",
  projectId: "landing-ce40b",
  storageBucket: "landing-ce40b.firebasestorage.app",
  messagingSenderId: "456731771280",
  appId: "1:456731771280:web:2d611f5cd24b37f6b3b315"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 3. Envolvemos todo en un evento para que sea una función válida
document.addEventListener('DOMContentLoaded', () => {
  
  const form = document.getElementById('form-newsletter');
  const emailInput = document.getElementById('infoenviar');
  const contadorText = document.getElementById('contador-suscritos');

  console.log("Elementos encontrados:", { form, emailInput, contadorText });

  // Ahora este return SÍ es válido porque está dentro de la función de flecha () => {}
  if (!form) {
    console.error("ERROR: No se encontró el formulario con id 'form-newsletter'");
    return;
  }

  const suscripcionesRef = ref(database, 'suscriptores');

  // --- ESCUCHAR CONTADOR ---
  onValue(suscripcionesRef, (snapshot) => {
    const data = snapshot.val();
    const totalSuscritos = data ? Object.keys(data).length : 0;
    
    if (contadorText) {
      contadorText.textContent = `${totalSuscritos} persona${totalSuscritos !== 1 ? 's' : ''} suscrita${totalSuscritos !== 1 ? 's' : ''}`;
    }
  });

  // --- ENVIAR FORMULARIO ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // ¡Ahora sí detendrá la recarga!
    console.log("Interceptando el envío...");

    const email = emailInput.value.trim();

    if (email) {
      try {
        const nuevaSuscripcionRef = push(suscripcionesRef);
        await set(nuevaSuscripcionRef, {
          email: email,
          fecha: new Date().toISOString()
        });

        emailInput.value = '';
        console.log("¡Guardado exitoso!");
        
      } catch (error) {
        console.error('Error al guardar en Firebase:', error);
      }
    }
  });
});