import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const AddNotification = () => {
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "notifications"), {
        ...formData,
        createdAt: serverTimestamp(),
        createdBy: localStorage.getItem("adminEmail"),
      });
      setStatus("✅ Notification posted successfully.");
      setFormData({ title: "", message: "" });
    } catch (error) {
      setStatus("❌ Failed: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">
        Add Notification
      </h2>
      <p className="text-sm text-right mb-2">
        <a
          href="/admin/allnotification"
          className="text-blue-600 hover:underline"
        >
          📋 View All Notifications
        </a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Notification Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="Enter detailed message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded h-28"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Post Notification
        </button>
        {status && <p className="text-sm mt-2 text-green-700">{status}</p>}
      </form>
    </div>
  );
};

export default AddNotification;
