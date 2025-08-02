import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AdminAuthContext } from "./AdminAuthContext.js";

const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists() && snap.data().role === "admin") {
        setAdmin({ ...snap.data(), uid: user.uid });
      } else {
        setAdmin(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
