import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFeedbackImage = async (file, userId) => {
    const imageRef = ref(storage, `feedback_images/${userId}_${Date.now()}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
};
