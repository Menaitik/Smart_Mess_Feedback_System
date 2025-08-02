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
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ title: "", message: "" });

  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const snapshot = await getDocs(collection(db, "notifications"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotifications(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this notification?")) {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications((prev) => prev.filter((n) => n.id !== id));
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-700">
          📋 All Notifications
        </h2>
        <button
          onClick={() => navigate("/admin/addnotification")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          ➕ Add Notification
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="border rounded p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              {editingId === n.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editedData.title}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full border p-1 rounded"
                  />
                  <textarea
                    value={editedData.message}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="w-full border p-1 rounded"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{n.title}</h3>
                  <p className="text-gray-600">{n.message}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Posted by {n.createdBy || "Admin"}
                  </p>
                </div>
              )}

              <div className="flex-shrink-0 space-x-2">
                {editingId === n.id ? (
                  <button
                    onClick={() => handleSave(n.id)}
                    className="text-green-600 font-medium hover:underline"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(n)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-red-600 font-medium hover:underline"
                >
                  Delete
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
