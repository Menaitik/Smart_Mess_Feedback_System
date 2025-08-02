// src/pages/admin/AdminDashboard.jsx
import { Link } from "react-router-dom";
import {
  Users,
  BellPlus,
  Bell,
  MessageSquareText,
  CalendarDays,
  UserCircle,
} from "lucide-react"; // optional icons using lucide-react (install with: npm i lucide-react)

const adminFeatures = [
  {
    label: "Manage Students",
    path: "/admin/studentlist",
    icon: <Users size={28} />,
  },
  {
    label: "Add Notification",
    path: "/admin/addnotification",
    icon: <BellPlus size={28} />,
  },
  {
    label: "All Notifications",
    path: "/admin/allnotification",
    icon: <Bell size={28} />,
  },
  {
    label: "View Feedback",
    path: "/admin/feedbacks",
    icon: <MessageSquareText size={28} />,
  },
  {
    label: "Manage Timetable",
    path: "/admin/timetable",
    icon: <CalendarDays size={28} />,
  },
  {
    label: "Admin Profile",
    path: "/admin/profile",
    icon: <UserCircle size={28} />,
  },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-indigo-700 mb-10 text-center">
          🏫 Admin Dashboard
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {adminFeatures.map(({ label, path, icon }) => (
            <Link
              to={path}
              key={label}
              className="flex flex-col items-center justify-center bg-white border border-indigo-200 rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-200 text-center"
            >
              <div className="mb-3 text-indigo-600">{icon}</div>
              <p className="font-semibold text-lg text-gray-800">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
