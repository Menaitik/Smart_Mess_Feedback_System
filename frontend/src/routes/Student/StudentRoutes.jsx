import { Route } from "react-router-dom";

import {
  Login,
  Home,
  StudentProfile,
  StudentNotification,
  StudentDashboard,
  StudentTimetable

} from "../../pages/index.js";


import StudentProtectedRoute from "./StudentProtectedRoute.jsx";

import StudentLayout from "../../layouts/Student_Layout.jsx";

const studentroute = (
  <>
    <Route path="/student/login" element={<Login />} />
    <Route path="/" element={<Home />} />
    <Route element={<StudentLayout />}>
      {/* Protected Route for student */}
      <Route element={<StudentProtectedRoute />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route
          path="/student/notifications"
          element={<StudentNotification />}
        />
        <Route path="/student/timetable" element={<StudentTimetable />} />
      </Route>
    </Route>
  </>
);

export default studentroute;
