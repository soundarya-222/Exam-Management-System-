import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Mock student data matching the backend userModel
const MOCK_STUDENT = {
  _id: "648a1f2e9b3c4d5e6f7a8b9c",
  name: "Arjun Sharma",
  email: "arjun.sharma@student.edu",
  role: "student",
  enrollmentNo: "STU2024001",
  department: "Computer Science",
  semester: "5th Semester",
  phone: "+91 98765 43210",
  joinedAt: "2022-08-01T00:00:00.000Z",
  avatar: null,
};

export function AuthProvider({ children }) {
  const [student] = useState(MOCK_STUDENT);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const logout = () => {
    setIsLoggedIn(false);
    // In real app: call authService.logout(), clear token, redirect
    alert("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ student, isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
