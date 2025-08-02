import { db } from "./firebaseConfig";
import { doc, setDoc, collection, getDocs, query } from "firebase/firestore";

// Add new student data after auth is created
export const addStudentProfile = async (uid, studentData) => {
    await setDoc(doc(db, "users", uid), studentData);
};

// Get all feedbacks (admin)
export const getAllFeedbacks = async () => {
    const q = query(collection(db, "feedbacks"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
