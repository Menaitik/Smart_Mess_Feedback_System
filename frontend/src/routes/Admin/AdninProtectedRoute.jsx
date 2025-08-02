// src/components/Protected/AdminProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AdminProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        const data = snap.data();

        if (snap.exists() && data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error checking admin role:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-10">Checking auth...</div>;

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoute;
