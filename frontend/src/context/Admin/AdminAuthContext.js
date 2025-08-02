import { createContext, useContext } from "react";

export const AdminAuthContext = createContext(null);

export const useAdminAuth = () => useContext(AdminAuthContext);
