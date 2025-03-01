// "use client"

// import { useState, useContext, useEffect } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import AuthContext from "../context/AuthContext"
// import Navbar from "../components/layout/Navbar"
// import Alert from "../components/ui/Alert"

// const Login = () => {
//   const navigate = useNavigate()
//   const { login, isAuthenticated, error, clearError } = useContext(AuthContext)

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [formError, setFormError] = useState("")
//   const [loading, setLoading] = useState(false)

//   const { email, password } = formData

//   useEffect(() => {
//     // If already authenticated, redirect to dashboard
//     if (isAuthenticated) {
//       navigate("/dashboard")
//     }

//     // Set form error from context if exists
//     if (error) {
//       setFormError(error)
//       clearError()
//     }
//   }, [isAuthenticated, navigate, error, clearError])

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const onSubmit = async (e) => {
//     e.preventDefault()
//     setFormError("")

//     // Validate form
//     if (!email || !password) {
//       setFormError("All fields are required")
//       return
//     }

//     setLoading(true)
//     const result = await login({
//       email,
//       password,
//     })
//     setLoading(false)

//     if (result.success) {
//       navigate("/dashboard")
//     } else {
//       setFormError(result.error)
//     }
//   }

//   return (
//     <div className="login-page">
//       <Navbar />

//       <div className="auth-container">
//         <div className="auth-card">
//           <h1>Login</h1>
//           <p className="auth-subtitle">Enter your credentials to access your account</p>

//           {formError && <Alert type="error" message={formError} />}

//           <form onSubmit={onSubmit}>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={email}
//                 onChange={onChange}
//                 placeholder="john@example.com"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input type="password" id="password" name="password" value={password} onChange={onChange} required />
//             </div>

//             <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <p className="auth-footer">
//             Don't have an account?{" "}
//             <Link to="/register" className="auth-link">
//               Register
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login

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
    if (isAuthenticated) navigate("/dashboard")
    if (error) {
      setFormError(error)
      clearError()
    }
  }, [isAuthenticated, navigate, error, clearError])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    if (!email || !password) {
      setFormError("All fields are required")
      return
    }

    setLoading(true)
    const result = await login({ email, password })
    setLoading(false)

    if (result.success) navigate("/dashboard")
    else setFormError(result.error)
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* <Navbar /> */}
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
        <p className="text-gray-500 mb-6 text-center">Enter your credentials to access your account</p>

        {formError && <Alert type="error" message={formError} />}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="john@example.com"
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
    </>
  )
}

export default Login
