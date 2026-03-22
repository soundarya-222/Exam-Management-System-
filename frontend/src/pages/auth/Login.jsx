import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService'
import { getRole, setRole, setToken } from '../../utils/auth'
import '../../styles/auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRoleState] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
const data = await loginUser({ email, password })
      setToken(data.token)
setRole(data.user.role)

if (data.user.role === 'student') {
        navigate('/student/dashboard')
        return
      }

if (data.user.role === 'teacher') {
        navigate('/teacher/dashboard')
        return
      }

      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="small">Login as student or teacher</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={(e) => setRoleState(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/register">Create account</a>
          </p>
        </div>

        <div className="current-role">
          Current role in storage: <strong>{getRole() || 'none'}</strong>
        </div>
      </div>
    </div>
  )
}

export default Login
