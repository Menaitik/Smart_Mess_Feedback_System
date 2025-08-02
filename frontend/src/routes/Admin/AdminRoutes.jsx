// routes/Admin/AdminRoutes.jsx
import { Route } from "react-router-dom";

import {
  AdminLogin,
  AddStudentForm,
  AdminDashboard,
  AdminProfile,
  AdminStudentList,
  EditStudent,
  AddNotification,
  AdminNotificationList,
  AdminTimetable,
  AdminFeedbacks
} from "../../pages/index.js";

import AdminLayout from "../../layouts/Admin_Layout.jsx";
import AdminProtectedRoute from "./AdninProtectedRoute.jsx";

const adminroute = (
  <>
    {/* Login is public */}
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Protected admin routes */}
    <Route element={<AdminProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/addstudent" element={<AddStudentForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/studentlist" element={<AdminStudentList />} />
        <Route path="/admin/editstudent/:id" element={<EditStudent />} />
        <Route path="/admin/addnotification" element={<AddNotification />} />
        <Route path="/admin/allnotification" element={<AdminNotificationList />} />
        <Route path="/admin/timetable" element={<AdminTimetable />} />
        <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />

      </Route>
    </Route>
  </>
);

export default adminroute;
