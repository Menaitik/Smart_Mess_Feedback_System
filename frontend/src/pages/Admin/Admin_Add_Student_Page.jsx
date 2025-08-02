import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db, app } from "../../firebase/firebaseConfig.js";
import { initializeApp } from "firebase/app";

// Create a secondary app to avoid admin logout
const secondaryApp = initializeApp(app.options, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    course: "",
    email: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const defaultPassword = "student@123";

    try {
      // 🔍 Check if email or roll already exists in Firestore
      const usersRef = collection(db, "users");

      const emailQuery = query(usersRef, where("email", "==", formData.email));
      const rollQuery = query(usersRef, where("roll", "==", formData.roll));

      const [emailSnap, rollSnap] = await Promise.all([
        getDocs(emailQuery),
        getDocs(rollQuery),
      ]);

      if (!emailSnap.empty) {
        setMessage("❌ This email is already registered.");
        return;
      }

      if (!rollSnap.empty) {
        setMessage("❌ This roll number is already in use.");
        return;
      }

      // ✅ Create student account using secondary auth
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        defaultPassword
      );
      const uid = userCredential.user.uid;

      // ✅ Save student profile to Firestore
      await setDoc(doc(db, "users", uid), {
        ...formData,
        uid,
        role: "student",
        createdAt: new Date(),
      });

      // ✅ Sign out secondary auth instance (cleanup)
      await signOut(secondaryAuth);

      // ✅ Reset form and show success message
      setMessage("✅ Student added successfully.");
      setFormData({ name: "", roll: "", course: "", email: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Add New Student
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {["name", "roll", "course", "email"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === "roll" ? "Roll / ID Number" : field}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={
                  field === "email"
                    ? "student@university.com"
                    : field === "roll"
                    ? "BCA2025012"
                    : field === "course"
                    ? "MCA"
                    : "John Doe"
                }
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition"
          >
            Add Student
          </button>

          {message && (
            <p className="text-center text-sm mt-4 font-medium text-green-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;
