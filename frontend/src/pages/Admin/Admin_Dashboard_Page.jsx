// src/pages/admin/AdminDashboard.jsx
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        🏫 Admin Dashboard
      </h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {[
          { label: "Manage Students", path: "/admin/studentlist" },
          { label: "Add Notification", path: "/admin/addnotification" },
          { label: "All Notifications", path: "/admin/allnotification" },
          { label: "View Feedback", path: "/admin/feedbacks" },
          { label: "Manage Timetable", path: "/admin/timetable" },
          { label: "Admin Profile", path: "/admin/profile" },
        ].map(({ label, path }) => (
          <Link
            to={path}
            key={label}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-4 rounded-lg text-center shadow-md font-semibold transition"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
