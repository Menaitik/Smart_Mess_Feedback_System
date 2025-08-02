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

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        defaultPassword
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        ...formData,
        uid,
        role: "student",
        createdAt: new Date(),
      });

      await signOut(secondaryAuth);

      setMessage("✅ Student added successfully.");
      setFormData({ name: "", roll: "", course: "", email: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 px-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-xl border border-white/30">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-wide">
          🎓 Add New Student
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {["name", "roll", "course", "email"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
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
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-md bg-white text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2.5 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            ➕ Add Student
          </button>

          {message && (
            <p
              className={`text-center mt-4 text-sm font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;
