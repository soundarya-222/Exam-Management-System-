import React from 'react'
import HomePage from '../../assets/HomePage.jpeg'
import './Home.css'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleDashboardClick = () => {
    if (user?.role?.toLowerCase() === 'teacher') {
      navigate('/teacher/dashboard')
    } else {
      navigate('/student/dashboard')
    }
  }

  return (
    <div className="home-page">
      <div className="herosection" style={{ backgroundImage: `url(${HomePage})` }}>
        <div className="hero-content">
          
          <h1>{isLoggedIn ? `Welcome back, ${user?.name || 'User'}!` : 'Welcome to TestZen'}</h1>
          <p className="subtitle">
            {isLoggedIn 
              ? 'Ready to continue with your exams?' 
              : 'Create, manage, and take exams smoothly with a modern, secure interface.'
            }
          </p>
          {isLoggedIn ? (
            <button className="hero-btn" onClick={handleDashboardClick}>
              Go to Dashboard
            </button>
          ) : (
            <div className="hero-buttons">
              <button className="hero-btn" ><a href='/login?role=student'>Login as Student</a></button>
              <button className="hero-btn" ><a href='/login?role=teacher'>Login as Teacher</a></button>
            </div>
          )}
        </div>
      </div>

     
    </div>
  )
}

export default Home
