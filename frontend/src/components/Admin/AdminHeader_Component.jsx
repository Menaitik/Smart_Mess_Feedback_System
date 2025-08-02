import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig.js";
import { signOut } from "firebase/auth";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  return (
    <header className="bg-indigo-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/admin/dashboard" className="text-2xl font-bold">
          🏫 Mess Admin
        </Link>
        <nav className="space-x-6 text-sm">
          <Link to="/admin/dashboard" className="hover:underline">
            Feedback
          </Link>
          <Link to="/admin/studentlist" className="hover:underline">
            Students
          </Link>
          <Link to="/admin/allnotification" className="hover:underline">
            Notifications
          </Link>
          <Link to="/admin/profile" className="hover:underline">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="ml-4 bg-white text-indigo-700 font-semibold px-3 py-1 rounded hover:bg-indigo-100 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
