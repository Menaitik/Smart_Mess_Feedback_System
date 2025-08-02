// src/pages/admin/EditStudent.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig.js";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    course: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, "users", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setFormData(snap.data());
        } else {
          setMessage("❌ Student not found.");
        }
      } catch (error) {
        setMessage("❌ Error fetching student.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const usersRef = collection(db, "users");

      // 🔍 Check for duplicate email (excluding current student)
      const emailQuery = query(usersRef, where("email", "==", formData.email));
      const emailSnap = await getDocs(emailQuery);
      const emailTaken = emailSnap.docs.some((doc) => doc.id !== id);
      if (emailTaken) {
        setMessage("❌ This email is already in use by another student.");
        return;
      }

      // 🔍 Check for duplicate roll (excluding current student)
      const rollQuery = query(usersRef, where("roll", "==", formData.roll));
      const rollSnap = await getDocs(rollQuery);
      const rollTaken = rollSnap.docs.some((doc) => doc.id !== id);
      if (rollTaken) {
        setMessage("❌ This roll number is already in use.");
        return;
      }

      // ✅ Proceed to update
      await updateDoc(doc(db, "users", id), {
        name: formData.name,
        roll: formData.roll,
        course: formData.course,
        email: formData.email,
      });

      setMessage("✅ Student updated successfully.");
      setTimeout(() => navigate("/admin/studentlist"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update student.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">
          Edit Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "roll", "course"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field}
              </label>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {message && (
            <p className="text-sm text-center text-green-600">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
