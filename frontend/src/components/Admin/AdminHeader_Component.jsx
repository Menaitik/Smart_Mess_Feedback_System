import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig.js";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react"; // Optional icon (install with: npm i lucide-react)

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Logo */}
        <Link
          to="/admin/dashboard"
          className="text-2xl font-bold tracking-wide hover:opacity-90"
        >
          🏫 Mess Admin
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link
            to="/admin/dashboard"
            className="hover:underline hover:underline-offset-4"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/studentlist"
            className="hover:underline hover:underline-offset-4"
          >
            Students
          </Link>
          <Link
            to="/admin/allnotification"
            className="hover:underline hover:underline-offset-4"
          >
            Notifications
          </Link>
          <Link
            to="/admin/profile"
            className="hover:underline hover:underline-offset-4"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-white text-indigo-700 font-semibold px-3 py-1.5 rounded hover:bg-indigo-100 transition shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
