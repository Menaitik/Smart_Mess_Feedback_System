import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("monday");

  useEffect(() => {
    const fetchTimetable = async () => {
      const data = {};
      for (const day of weekdays) {
        try {
          const snap = await getDoc(doc(db, "timetable", day));
          if (snap.exists()) {
            data[day] = snap.data();
          }
        } catch (err) {
          console.error(`Error fetching ${day} timetable:`, err);
        }
      }
      setTimetable(data);
      setLoading(false);
    };

    fetchTimetable();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          📅 Weekly Mess Timetable
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {weekdays.map((day) => (
            <button
              key={day}
              className={`capitalize px-4 py-2 rounded-md font-medium ${
                selectedDay === day
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timetable Content */}
        {loading ? (
          <p className="text-center text-gray-600">Loading timetable...</p>
        ) : (
          <div>
            {timetable[selectedDay] ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2 text-center">
                  {selectedDay}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  {["breakfast", "lunch", "dinner"].map((meal) => {
                    const item = timetable[selectedDay][meal];
                    return item ? (
                      <div
                        key={meal}
                        className="bg-purple-50 border border-purple-200 rounded-md p-3"
                      >
                        <p className="font-semibold capitalize">🍽️ {meal}</p>
                        <p>🕒 {item.time}</p>
                        <p>🍛 {item.items}</p>
                      </div>
                    ) : (
                      <div
                        key={meal}
                        className="bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-500 italic"
                      >
                        {meal} not set
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">
                No meals set for {selectedDay}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTimetable;
