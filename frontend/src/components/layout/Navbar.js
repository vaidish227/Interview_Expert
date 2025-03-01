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
    <ul className="flex items-center space-x-4">
      <li>
        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/new-interview" className="text-gray-600 hover:text-gray-900">
          New Interview
        </Link>
      </li>
      <li>
        <button onClick={onLogout} className="text-gray-600 hover:text-gray-900">
          Logout
        </button>
      </li>
      <li className="text-gray-600">
        <span>Hello, {user?.name}</span>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul className="flex items-center space-x-4">
      <li>
        <Link to="/login" className="text-gray-600 hover:text-gray-900">
          Login
        </Link>
      </li>
      <li>
        <Link to="/register" className="text-gray-600 hover:text-gray-900">
          Register
        </Link>
      </li>
    </ul>
  )

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          AI Interviewer
        </Link>
        <div className="navbar-menu">{isAuthenticated ? authLinks : guestLinks}</div>
      </div>
    </nav>
  )
}

export default Navbar
