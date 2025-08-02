import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const StudentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, "notifications"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          📢 Notifications
        </h2>

        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-center">
            No notifications available.
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="border rounded p-4 shadow-sm bg-gray-50"
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  {n.title}
                </h3>
                <p className="text-gray-700 mt-1">{n.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted by: {n.createdBy || "Admin"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotification;
