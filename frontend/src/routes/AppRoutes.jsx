import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import StudentDashboard from '../pages/StudentDashboard'
import TeacherDashboard from '../pages/teacher/TeacherDashboard'
import { getToken, getRole } from '../utils/auth'

const ProtectedRoute = ({ element, requiredRole }) => {
  const token = getToken()
  const role = getRole()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return element
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/student/dashboard"
        element={<StudentDashboard />} 
      />
      <Route
        path="/teacher/dashboard"
        element={<TeacherDashboard />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
