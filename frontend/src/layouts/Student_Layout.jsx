import { Outlet } from "react-router";
import { StudentHeader, StudentFooter } from "../components";

const StudentLayout = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <StudentHeader />

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      <StudentFooter />
    </div>
  );
};

export default StudentLayout;
