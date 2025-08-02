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
    <div className="min-h-screen bg-gradient-to-tr from-[#f9fafb] via-[#e0f2f1] to-[#e8eaf6] p-6">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 border-b pb-2">
          📢 Notifications
        </h2>

        {loading ? (
          <p className="text-gray-700 text-center animate-pulse">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-600 text-center italic">
            No notifications available.
          </p>
        ) : (
          <div className="space-y-6">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition duration-300 border-l-4 border-purple-500"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {n.title}
                </h3>
                <p className="text-gray-700">{n.message}</p>
                <p className="text-sm text-gray-500 mt-3">
                  Posted by:{" "}
                  <span className="font-medium">{n.createdBy || "Admin"}</span>
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
