"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)

  const onLogout = () => {
    logout()
  }

  const authLinks = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/new-interview" className="nav-link">
          New Interview
        </Link>
      </li>
      <li className="nav-item">
        <button onClick={onLogout} className="btn btn-link nav-link">
          Logout
        </button>
      </li>
      <li className="nav-item user-greeting">
        <span>Hello, {user?.name}</span>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/register" className="nav-link">
          Register
        </Link>
      </li>
    </ul>
  )

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          AI Interviewer
        </Link>
        <div className="navbar-menu">{isAuthenticated ? authLinks : guestLinks}</div>
      </div>
    </nav>
  )
}

export default Navbar

