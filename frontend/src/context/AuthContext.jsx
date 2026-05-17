// Contexto de autenticacion administrativa.
// Guarda token JWT, usuario admin y funciones login/logout para toda la app.

import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("polibarber_token"));
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem("polibarber_admin");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("polibarber_token", data.token);
    localStorage.setItem("polibarber_admin", JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("polibarber_token");
    localStorage.removeItem("polibarber_admin");
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(() => ({ token, admin, login, logout }), [token, admin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
