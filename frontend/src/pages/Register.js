"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import Navbar from "../components/layout/Navbar"
import Alert from "../components/ui/Alert"

const Register = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)

  const { name, email, password, confirmPassword } = formData

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
    if (!name || !email || !password || !confirmPassword) {
      setFormError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const result = await register({
      name,
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
    <div className="register-page">
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <h1>Create an Account</h1>
          <p className="auth-subtitle">Enter your information to create an account</p>

          {formError && <Alert type="error" message={formError} />}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe"
                required
              />
            </div>

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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

