import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const meals = ["breakfast", "lunch", "dinner"];

const AdminTimetable = () => {
  const [timetable, setTimetable] = useState({});
  const [status, setStatus] = useState("");
  const [selectedDay, setSelectedDay] = useState("monday");

  useEffect(() => {
    const fetchTimetable = async () => {
      const snapshot = await getDocs(collection(db, "timetable"));
      const data = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data();
      });
      setTimetable(data);
    };
    fetchTimetable();
  }, []);

  const handleChange = (day, meal, field, value) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: {
          ...prev[day]?.[meal],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async (day) => {
    try {
      const docRef = doc(db, "timetable", day);
      await setDoc(docRef, timetable[day], { merge: true });

      await addDoc(collection(db, "notifications"), {
        title: `🧾 Timetable Updated: ${day}`,
        message: `Updated meals for ${day}.`,
        createdAt: serverTimestamp(),
        createdBy: "Admin",
      });

      setStatus(`✅ Timetable updated for ${day}`);
      setTimeout(() => setStatus(""), 2000);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to save timetable.");
    }
  };

  const handleDeleteMeal = async (day, meal) => {
    const updated = { ...timetable };
    if (updated[day]) {
      delete updated[day][meal];
      setTimetable(updated);
      await updateDoc(doc(db, "timetable", day), {
        [meal]: deleteField(),
      });
      setStatus(`❌ Deleted ${meal} for ${day}`);
      setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
          🧾 Admin Timetable Editor
        </h2>

        {/* Day Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`capitalize px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
                selectedDay === day
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Status Message */}
        {status && (
          <div className="text-center mb-4 text-green-700 font-medium animate-pulse">
            {status}
          </div>
        )}

        {/* Editable Timetable */}
        <div className="bg-white shadow-inner p-6 rounded-lg border border-indigo-200">
          <h3 className="text-xl font-semibold text-purple-700 capitalize mb-4">
            Edit Meals for {selectedDay}
          </h3>

          {meals.map((meal) => (
            <div
              key={meal}
              className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 shadow-sm"
            >
              <p className="text-lg font-medium text-gray-800 mb-2 capitalize">
                🍽️ {meal}
              </p>
              <input
                type="text"
                placeholder="Time (e.g., 8:00 AM - 9:00 AM)"
                value={timetable[selectedDay]?.[meal]?.time || ""}
                onChange={(e) =>
                  handleChange(selectedDay, meal, "time", e.target.value)
                }
                className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <textarea
                placeholder="Food items (e.g., Poha, Tea, Eggs)"
                value={timetable[selectedDay]?.[meal]?.items || ""}
                onChange={(e) =>
                  handleChange(selectedDay, meal, "items", e.target.value)
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
              ></textarea>
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleDeleteMeal(selectedDay, meal)}
                  className="text-sm text-red-600 hover:text-red-800 hover:underline"
                >
                  ❌ Delete {meal}
                </button>
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              onClick={() => handleSave(selectedDay)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
            >
              💾 Save {selectedDay}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTimetable;
