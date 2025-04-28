// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Suas credenciais
const firebaseConfig = {
  apiKey: "AIzaSyBryXaJs23XI-d_kutPorrvcVmFbZQWGCs",
  authDomain: "misparent-52435.firebaseapp.com",
  projectId: "misparent-52435",
  storageBucket: "misparent-52435.appspot.com", // (corrigi aqui também: você tinha escrito errado "firebasestorage.app", era "appspot.com")
  messagingSenderId: "27128374086",
  appId: "1:27128374086:web:c481eb7634bdf731afbb47",
  measurementId: "G-Q5YQ8VE712"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Inicializa o auth com AsyncStorage (persistência)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializa o firestore
const firestore = getFirestore(app);

export { auth, firestore };
