// routes/Student/StudentProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

const StudentProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsStudent(false);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Check role in Firestore
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists() && snap.data().role === "student") {
          setIsStudent(true);
        } else {
          setIsStudent(false);
        }
      } catch (err) {
        console.error("Error checking student role:", err);
        setIsStudent(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Checking student role...</p>;

  return user && isStudent ? <Outlet /> : <Navigate to="/student/login" />;
};

export default StudentProtectedRoute;
