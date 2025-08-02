import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, updatePassword } from "firebase/auth";

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    roll: "",
    email: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            setFormData({
              ...snap.data(),
              email: user.email, // fallback
            });
          } else {
            setMessage("❌ User data not found");
          }
        } catch (err) {
          setMessage("❌ Failed to fetch profile");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setMessage("❌ Not authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!newPassword.trim()) {
      setMessage("❌ Please enter a new password.");
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage("✅ Password updated successfully");
      setNewPassword("");
    } catch (err) {
      setMessage("❌ Failed to update password: " + err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-600 p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
          Student Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "course", "roll"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === "roll" ? "Roll / ID Number" : field}
              </label>
              <input
                name={field}
                value={formData[field]}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border rounded-md cursor-not-allowed"
              />
            </div>
          ))}

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Password <span className="text-gray-400">(required)</span>
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {message && (
            <p className="text-sm text-center text-green-600">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
