import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const AdminNotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ title: "", message: "" });
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const snapshot = await getDocs(collection(db, "notifications"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Sort by date descending (latest first)
    const sorted = data.sort(
      (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
    );
    setNotifications(sorted);
    setFiltered(sorted);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this notification?")) {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setFiltered((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleEdit = (notif) => {
    setEditingId(notif.id);
    setEditedData({ title: notif.title, message: notif.message });
  };

  const handleSave = async (id) => {
    await updateDoc(doc(db, "notifications", id), editedData);
    setEditingId(null);
    fetchNotifications();
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (value === "") {
      setFiltered(notifications);
    } else {
      const searchLower = value.toLowerCase();
      setFiltered(
        notifications.filter((n) => n.title.toLowerCase().includes(searchLower))
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-xl mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          📢 Notifications
        </h2>
        <button
          onClick={() => navigate("/admin/addnotification")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-all font-medium"
        >
          ➕ Add Notification
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="🔍 Search by title..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No notifications found.
        </p>
      ) : (
        <div className="space-y-5">
          {filtered.map((n) => (
            <div
              key={n.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all"
            >
              {editingId === n.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedData.title}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Title"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <textarea
                    value={editedData.message}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Message"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {n.title}
                  </h3>
                  <p className="text-gray-700 mt-1">{n.message}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Posted by: {n.createdBy || "Admin"}{" "}
                    {n.timestamp?.seconds && (
                      <>
                        •{" "}
                        {new Date(n.timestamp.seconds * 1000).toLocaleString()}
                      </>
                    )}
                  </p>
                </div>
              )}

              <div className="mt-4 flex gap-4">
                {editingId === n.id ? (
                  <button
                    onClick={() => handleSave(n.id)}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    💾 Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(n)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ✏️ Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationList;
