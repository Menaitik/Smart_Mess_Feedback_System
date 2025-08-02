import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const AddNotification = () => {
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    try {
      await addDoc(collection(db, "notifications"), {
        ...formData,
        createdAt: serverTimestamp(),
        createdBy: "Admin", // 👈 Only shows 'Admin', not email
      });
      setStatus("✅ Notification posted successfully.");
      setFormData({ title: "", message: "" });
    } catch (err) {
      setError("❌ Failed to post notification: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 border border-indigo-200 rounded-3xl shadow-2xl mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 tracking-tight">
          📢 Add Notification
        </h2>
        <a
          href="/admin/allnotification"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition"
        >
          📋 View All
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter notification title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Message
          </label>
          <textarea
            name="message"
            placeholder="Enter detailed message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg transition duration-200"
        >
          🚀 Post Notification
        </button>

        {status && (
          <div className="text-green-700 bg-green-100 border border-green-300 p-2 rounded-md text-sm mt-3">
            {status}
          </div>
        )}
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 p-2 rounded-md text-sm mt-3">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddNotification;
