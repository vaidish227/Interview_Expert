"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute
