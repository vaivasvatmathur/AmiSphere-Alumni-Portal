import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("adminUser");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      admin,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [admin, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
