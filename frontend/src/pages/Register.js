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
    if (isAuthenticated) {
      navigate("/dashboard")
    }

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
    const result = await register({ name, email, password })
    setLoading(false)

    if (result.success) {
      navigate("/dashboard")
    } else {
      setFormError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Create an Account</h1>
          <p className="text-gray-600 mb-6 text-center">Enter your information to create an account</p>

          {formError && <Alert type="error" message={formError} />}

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Name"
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account? {" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
