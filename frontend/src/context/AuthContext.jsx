/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken, setRole, removeToken } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const token = getToken();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(token));
  const [loading] = useState(false);

  const login = (userData, jwtToken) => {
    const normalizedRole = (userData?.role || "student").toLowerCase();
    setUser({ ...userData, role: normalizedRole });
    setIsLoggedIn(true);

    if (jwtToken) {
      setToken(jwtToken);
    }

    setRole(normalizedRole);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    removeToken();
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
