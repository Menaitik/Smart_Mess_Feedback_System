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
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        📅 Weekly Timetable Editor
      </h2>

      {/* Day Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`capitalize px-4 py-2 rounded ${
              selectedDay === day
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {status && (
        <p className="text-sm text-center mb-3 text-green-700">{status}</p>
      )}

      {/* Selected Day Form */}
      <div key={selectedDay} className="mb-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-2 capitalize">
          {selectedDay}
        </h3>

        {meals.map((meal) => (
          <div key={meal} className="mb-3">
            <p className="font-medium capitalize text-gray-700 mb-1">
              🍽️ {meal}
            </p>
            <input
              type="text"
              placeholder="Time (e.g., 8:00 AM - 9:00 AM)"
              value={timetable[selectedDay]?.[meal]?.time || ""}
              onChange={(e) =>
                handleChange(selectedDay, meal, "time", e.target.value)
              }
              className="w-full mb-1 px-3 py-1 border rounded-md"
            />
            <textarea
              placeholder="Food items (e.g., Poha, Tea, Eggs)"
              value={timetable[selectedDay]?.[meal]?.items || ""}
              onChange={(e) =>
                handleChange(selectedDay, meal, "items", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md"
            />
            <div className="flex justify-end gap-3 mt-1">
              <button
                onClick={() => handleDeleteMeal(selectedDay, meal)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete {meal}
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => handleSave(selectedDay)}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save {selectedDay}
        </button>
      </div>
    </div>
  );
};

export default AdminTimetable;
