// src/pages/admin/AdminFeedbacks.jsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { format } from "date-fns";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all"); // today, week, all
  const [mealFilter, setMealFilter] = useState("all"); // all, breakfast, lunch, dinner

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const q = query(
          collection(db, "feedbacks"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbacks(data);
      } catch (err) {
        console.error("❌ Failed to fetch feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday

    const filteredData = feedbacks.filter((fb) => {
      const date = fb.createdAt?.toDate?.();
      if (!date) return false;

      // Time filter
      if (timeFilter === "today" && date < startOfToday) return false;
      if (timeFilter === "week" && date < startOfWeek) return false;

      // Meal filter
      if (mealFilter !== "all" && (!fb.meals || !fb.meals.includes(mealFilter)))
        return false;

      return true;
    });

    setFiltered(filteredData);
  }, [feedbacks, timeFilter, mealFilter]);

  const groupByDate = (data) => {
    return data.reduce((acc, fb) => {
      const dateObj = fb.createdAt?.toDate?.();
      const key = dateObj
        ? `${format(dateObj, "EEEE")} (${format(dateObj, "dd MMM yyyy")})`
        : "Unknown Date";
      if (!acc[key]) acc[key] = [];
      acc[key].push(fb);
      return acc;
    }, {});
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        🗣️ All Feedbacks
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div>
          <label className="mr-2 font-medium">📅 Date:</label>
          {["today", "week", "all"].map((val) => (
            <button
              key={val}
              onClick={() => setTimeFilter(val)}
              className={`px-3 py-1 rounded border ${
                timeFilter === val
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              } mr-2`}
            >
              {val === "today" ? "Today" : val === "week" ? "This Week" : "All"}
            </button>
          ))}
        </div>
        <div>
          <label className="mr-2 font-medium">🍽️ Meal:</label>
          {["all", "breakfast", "lunch", "dinner"].map((meal) => (
            <button
              key={meal}
              onClick={() => setMealFilter(meal)}
              className={`px-3 py-1 rounded border ${
                mealFilter === meal
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700"
              } mr-2`}
            >
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback display */}
      {loading ? (
        <p className="text-gray-500">Loading feedbacks...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">
          No feedbacks match the selected filters.
        </p>
      ) : (
        Object.entries(groupByDate(filtered)).map(([date, list]) => (
          <div key={date} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{date}</h3>
            <div className="space-y-3">
              {list.map((fb) => (
                <div key={fb.id} className="bg-white border shadow rounded p-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{fb.email}</span>
                    <span>
                      {fb.createdAt?.toDate
                        ? fb.createdAt.toDate().toLocaleTimeString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="mb-2 text-gray-800">{fb.feedback}</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>🍽️ Meals: {fb.meals?.join(", ")}</p>
                    <p>🌟 Hygiene: {fb.ratings?.hygiene}</p>
                    <p>🌟 Quality: {fb.ratings?.quality}</p>
                    <p>🌟 Quantity: {fb.ratings?.quantity}</p>
                    <p>🌟 Staff: {fb.ratings?.staff}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminFeedbacks;

