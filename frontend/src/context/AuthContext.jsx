/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { getRole, removeToken } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const role = getRole();

  const [user, setUser] = useState(role ? { role } : null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(role));
  const [loading] = useState(false);

  const login = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
