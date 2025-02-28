"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import Navbar from "../components/layout/Navbar"
import Alert from "../components/ui/Alert"

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)

  const { email, password } = formData

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard")
    }

    // Set form error from context if exists
    if (error) {
      setFormError(error)
      clearError()
    }
  }, [isAuthenticated, navigate, error, clearError])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    // Validate form
    if (!email || !password) {
      setFormError("All fields are required")
      return
    }

    setLoading(true)
    const result = await login({
      email,
      password,
    })
    setLoading(false)

    if (result.success) {
      navigate("/dashboard")
    } else {
      setFormError(result.error)
    }
  }

  return (
    <div className="login-page">
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <h1>Login</h1>
          <p className="auth-subtitle">Enter your credentials to access your account</p>

          {formError && <Alert type="error" message={formError} />}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={password} onChange={onChange} required />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

