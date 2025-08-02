import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

const StudentHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/student/login");
  };

  return (
    <header className="bg-green-600 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* 🎓 Logo (Clickable to Home) */}
        <Link
          to="/student/dashboard"
          className="text-xl font-bold "
        >
          🎓 Student Portal
        </Link>

        <nav className="space-x-4">
          <Link to="/student/dashboard" className="hover:underline">
            Home
          </Link>
          <Link to="/student/notifications" className="hover:underline">
            Notifications
          </Link>
          <Link to="/student/profile" className="hover:underline">
            Profile
          </Link>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default StudentHeader;
