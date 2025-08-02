import { Outlet } from "react-router";
import { AdminHeader, AdminFooter } from "../components";

const AdminLayout = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <AdminHeader />

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
