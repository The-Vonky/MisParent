import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBryXaJs23XI-d_kutPorrvcVmFbZQWGCs",
  authDomain: "misparent-52435.firebaseapp.com",
  projectId: "misparent-52435",
  storageBucket: "misparent-52435.firebasestorage.app",
  messagingSenderId: "27128374086",
  appId: "1:27128374086:web:c481eb7634bdf731afbb47",
  measurementId: "G-Q5YQ8VE712"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { auth };