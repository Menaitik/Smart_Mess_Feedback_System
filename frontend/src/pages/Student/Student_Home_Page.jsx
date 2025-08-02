import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

// ⭐ StarRating UI
const StarRating = ({ label, value, onChange }) => (
  <div className="mb-4">
    <p className="text-sm font-medium text-gray-700 mb-1">
      {label}: {value} / 5
    </p>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  </div>
);

// ⏰ Convert "8:00 AM" to Date object
const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );
};

const StudentDashboard = () => {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [todayMenu, setTodayMenu] = useState(null);
  const [submittedMeals, setSubmittedMeals] = useState([]);
  const [ratings, setRatings] = useState({
    hygiene: 3,
    quality: 3,
    quantity: 3,
    staff: 3,
  });
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [allowedMeals, setAllowedMeals] = useState([]);

  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(new Date());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setStudentEmail(user.email);
        await fetchSubmittedFeedbacks(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const docRef = doc(db, "timetable", weekday.toLowerCase());
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const menu = snap.data();
          setTodayMenu(menu);
          checkMealWindows(menu);
        } else {
          setTodayMenu(null);
        }
      } catch (err) {
        console.error("❌ Failed to load timetable:", err);
      }
    };
    fetchMenu();
  }, [weekday]);

  const saveSubmittedToLocal = (uid, meals) => {
    const key = `feedback_${new Date().toLocaleDateString()}_${uid}`;
    localStorage.setItem(key, JSON.stringify(meals));
  };

  const getSubmittedFromLocal = (uid) => {
    const key = `feedback_${new Date().toLocaleDateString()}_${uid}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  const fetchSubmittedFeedbacks = async (uid) => {
    if (!uid) return;

    const todayMeals = getSubmittedFromLocal(uid);

    if (todayMeals.length === 0) {
      const q = query(collection(db, "feedbacks"), where("uid", "==", uid));
      const snapshot = await getDocs(q);

      const today = new Date().toLocaleDateString();
      const submitted = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data?.createdAt || !data?.meals) return;

        const createdAt = new Date(
          data.createdAt?.seconds
            ? data.createdAt.seconds * 1000
            : data.createdAt
        );
        const feedbackDate = createdAt.toLocaleDateString();

        if (feedbackDate === today) {
          submitted.push(...data.meals);
        }
      });

      setSubmittedMeals(submitted);
      saveSubmittedToLocal(uid, submitted);
    } else {
      setSubmittedMeals(todayMeals);
    }
  };

  const checkMealWindows = (menu) => {
    const now = new Date();
    const activeMeals = [];

    const mealTimes = ["breakfast", "lunch", "dinner"]
      .filter((meal) => menu[meal])
      .map((meal, index, array) => {
        const start = parseTime(menu[meal].time.split("-")[0].trim());
        const end = array[index + 1]
          ? parseTime(menu[array[index + 1]].time.split("-")[0].trim())
          : new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate(),
              23,
              59
            );
        return { meal, start, end };
      });

    mealTimes.forEach(({ meal, start, end }) => {
      if (now >= start && now <= end) {
        activeMeals.push(meal);
      }
    });

    setAllowedMeals(activeMeals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const selectedMeals = Object.entries(meals)
      .filter(([, selected]) => selected)
      .map(([meal]) => meal);

    if (selectedMeals.length === 0) {
      setStatus("❌ Please select at least one meal.");
      return;
    }

    const duplicate = selectedMeals.some((meal) =>
      submittedMeals.includes(meal)
    );
    if (duplicate) {
      setStatus("❌ You already submitted feedback for selected meal(s).");
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        uid: auth.currentUser?.uid || null,
        email: isAnonymous ? "anonymous" : studentEmail,
        anonymous: isAnonymous,
        feedback,
        ratings,
        meals: selectedMeals,
        createdAt: new Date(),
      });

      const updatedMeals = [...submittedMeals, ...selectedMeals];
      setFeedback("");
      setMeals({ breakfast: false, lunch: false, dinner: false });
      setRatings({ hygiene: 3, quality: 3, quantity: 3, staff: 3 });
      setStatus("✅ Feedback submitted successfully.");
      setSubmittedMeals(updatedMeals);
      saveSubmittedToLocal(auth.currentUser?.uid, updatedMeals);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to submit feedback.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
          🎓 Student Feedback
        </h2>

        {/* 🍽️ Today's Menu */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            📅 Today's Menu
          </h3>
          {todayMenu ? (
            ["breakfast", "lunch", "dinner"].some((meal) => todayMenu[meal]) ? (
              <div className="text-sm text-gray-800 space-y-2">
                {["breakfast", "lunch", "dinner"].map((meal) =>
                  todayMenu[meal] ? (
                    <div key={meal}>
                      <strong className="capitalize">{meal}:</strong>{" "}
                      {todayMenu[meal].items} <br />
                      <span className="text-xs text-gray-600">
                        ({todayMenu[meal].time})
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No meals set for today.</p>
            )
          ) : (
            <p className="text-sm text-gray-500">
              No timetable found for today.
            </p>
          )}
          <div className="mt-3 text-right">
            <Link
              to="/student/timetable"
              className="text-green-600 text-sm underline hover:text-green-800"
            >
              📖 View full timetable
            </Link>
          </div>
        </div>

        <div className="text-center text-gray-600 mb-4">
          {isAnonymous
            ? "Your feedback will be submitted anonymously."
            : `Feedback will be submitted as ${studentEmail}`}
        </div>

        <div className="flex justify-end mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous((prev) => !prev)}
              className="w-4 h-4"
            />
            Submit Anonymously
          </label>
        </div>

        <div className="mb-6">
          <p className="font-medium text-gray-700 mb-2">Select Meal(s):</p>
          <div className="flex gap-6 flex-wrap">
            {["breakfast", "lunch", "dinner"].map((meal) => {
              const isSubmitted = submittedMeals.includes(meal);
              const isActive = allowedMeals.includes(meal);
              return (
                <label
                  key={meal}
                  className={`flex items-center gap-2 capitalize ${
                    !isActive || isSubmitted ? "text-gray-400" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isActive || isSubmitted}
                    checked={meals[meal]}
                    onChange={() =>
                      setMeals((prev) => ({
                        ...prev,
                        [meal]: !prev[meal],
                      }))
                    }
                  />
                  {meal}
                  {isSubmitted && " (submitted)"}
                  {!isSubmitted && !isActive && " (not available now)"}
                </label>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          {Object.entries(ratings).map(([key, value]) => (
            <StarRating
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={(val) =>
                setRatings((prev) => ({ ...prev, [key]: val }))
              }
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Write any additional feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-3 border rounded-md h-28 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700"
          >
            Submit Feedback
          </button>
          {status && (
            <p className="text-center text-sm font-medium text-green-800 mt-2">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;
