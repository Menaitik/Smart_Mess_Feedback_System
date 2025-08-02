import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getFunctions} from "firebase/functions";


const firebaseConfig = {
    apiKey: "AIzaSyAHRxkUjBn5qFgQIX11DVpMxFDUHdTA9oI",
    authDomain: "mess-feedback-3637b.firebaseapp.com",
    projectId: "mess-feedback-3637b",
    storageBucket: "mess-feedback-3637b.firebasestorage.app",
    messagingSenderId: "578710143364",
    appId: "1:578710143364:web:d65ff7120824392e809dd1",
    measurementId: "G-KD557KJDBE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // optional

export const functions = getFunctions(app);

export {app};
