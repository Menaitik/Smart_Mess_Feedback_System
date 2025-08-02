import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setMessage("❌ User not authenticated");
        setLoading(false);
        return;
      }

      const uid = user.uid;

      try {
        const docRef = doc(db, "users", uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setFormData({
            name: data.name || "",
            contact: data.contact || "",
            email: data.email || user.email,
          });
        } else {
          setMessage("❌ No profile data found.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setMessage("❌ Failed to fetch profile: " + error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not authenticated");

      await updateDoc(doc(db, "users", uid), {
        name: formData.name,
        contact: formData.contact,
      });

      setMessage("✅ Profile updated successfully");
    } catch (error) {
      console.error("Update Error:", error);
      setMessage("❌ Update failed: " + error.message);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Admin Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={formData.email}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border rounded-md cursor-not-allowed"
            />
          </div>

          {message && (
            <p className="text-sm text-center text-green-600">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
