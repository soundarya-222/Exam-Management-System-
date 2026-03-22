import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/authService'
import '../../styles/auth.css'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    // Client-side validation
    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters long')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const nameParts = name.trim().split(' ');
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';
      
      await registerUser({ fullname: {firstname, lastname}, email, password, role })
      navigate('/login')
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.errors && err.response.data.errors[0]?.msg) || 
                          err.message ||
                          'Unable to register. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="small">Register as student or teacher</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name (e.g., John Doe)"
            required
          />

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
            placeholder="Create a strong password"
            required
          />

          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
