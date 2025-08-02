import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { format } from "date-fns";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [mealFilter, setMealFilter] = useState("all");

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
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const filteredData = feedbacks.filter((fb) => {
      const date = fb.createdAt?.toDate?.();
      if (!date) return false;

      if (timeFilter === "today" && date < startOfToday) return false;
      if (timeFilter === "week" && date < startOfWeek) return false;
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
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">
        🗣️ All Feedbacks
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm">
        <div>
          <label className="mr-2 font-semibold text-gray-700">📅 Date:</label>
          {["today", "week", "all"].map((val) => (
            <button
              key={val}
              onClick={() => setTimeFilter(val)}
              className={`px-3 py-1.5 rounded-md border transition ${
                timeFilter === val
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } mr-2`}
            >
              {val === "today" ? "Today" : val === "week" ? "This Week" : "All"}
            </button>
          ))}
        </div>
        <div>
          <label className="mr-2 font-semibold text-gray-700">🍽️ Meal:</label>
          {["all", "breakfast", "lunch", "dinner"].map((meal) => (
            <button
              key={meal}
              onClick={() => setMealFilter(meal)}
              className={`px-3 py-1.5 rounded-md border transition ${
                mealFilter === meal
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } mr-2`}
            >
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feedbacks */}
      {loading ? (
        <p className="text-gray-600 text-center">Loading feedbacks...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-center">
          No feedbacks match the selected filters.
        </p>
      ) : (
        Object.entries(groupByDate(filtered)).map(([date, list]) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
              {date}
            </h3>
            <div className="space-y-4">
              {list.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>{fb.email}</span>
                    <span>
                      {fb.createdAt?.toDate
                        ? fb.createdAt.toDate().toLocaleTimeString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="text-gray-800 mb-3">{fb.feedback}</div>
                  <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <p>
                      🍽️ <strong>Meals:</strong> {fb.meals?.join(", ")}
                    </p>
                    <p>
                      🧼 <strong>Hygiene:</strong> {fb.ratings?.hygiene}
                    </p>
                    <p>
                      🥗 <strong>Quality:</strong> {fb.ratings?.quality}
                    </p>
                    <p>
                      🍛 <strong>Quantity:</strong> {fb.ratings?.quantity}
                    </p>
                    <p>
                      👨‍🍳 <strong>Staff:</strong> {fb.ratings?.staff}
                    </p>
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
