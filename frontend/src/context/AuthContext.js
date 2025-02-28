"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token
      localStorage.setItem("token", token)
    } else {
      delete axios.defaults.headers.common["x-auth-token"]
      localStorage.removeItem("token")
    }
  }

  // Load user
  const loadUser = async () => {
    if (token) {
      setAuthToken(token)

      try {
        const res = await axios.get("/api/users/me")
        setUser(res.data)
        setIsAuthenticated(true)
      } catch (err) {
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        setAuthToken(null)
      }
    }

    setLoading(false)
  }

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post("/api/auth/register", formData)

      setToken(res.data.token)
      setAuthToken(res.data.token)
      await loadUser()

      return { success: true }
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : "Registration failed")

      return { success: false, error: err.response?.data?.message || "Registration failed" }
    }
  }

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post("/api/auth/login", formData)

      setToken(res.data.token)
      setAuthToken(res.data.token)
      await loadUser()

      return { success: true }
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : "Invalid credentials")

      return { success: false, error: err.response?.data?.message || "Invalid credentials" }
    }
  }

  // Logout user
  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    setAuthToken(null)
  }

  // Clear errors
  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    loadUser()
    // eslint-disable-next-line
  }, [])

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

