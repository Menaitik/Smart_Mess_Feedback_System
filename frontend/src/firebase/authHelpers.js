import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};
