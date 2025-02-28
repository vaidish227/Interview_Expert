import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/routing/PrivateRoute"

// Pages
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import NewInterview from "./pages/NewInterview"
import InterviewSession from "./pages/InterviewSession"
import InterviewReport from "./pages/InterviewReport"
import NotFound from "./pages/NotFound"

// Styles
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/new-interview"
            element={
              <PrivateRoute>
                <NewInterview />
              </PrivateRoute>
            }
          />

          <Route
            path="/interview/:id"
            element={
              <PrivateRoute>
                <InterviewSession />
              </PrivateRoute>
            }
          />

          <Route
            path="/interview/:id/report"
            element={
              <PrivateRoute>
                <InterviewReport />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

