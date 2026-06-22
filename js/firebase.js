
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
    import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
  // Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export let saveVote = async (productID) => {
  try {
    const votesRef = ref(db, 'votes');
    const newUserRef = push(votesRef);
    
    let result = {
      productID: productID,
      date: new Date().toISOString()
    };

    await set(newUserRef, result);
    return { status: 'success', message: 'Voto guardado exitosamente.' };
  } catch (error) {
    return { status: 'error', message: `Error al guardar el voto: ${error.message}` };
  }
};
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
