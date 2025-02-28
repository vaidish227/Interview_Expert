"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import AuthContext from "../context/AuthContext"
import Navbar from "../components/layout/Navbar"
import Alert from "../components/ui/Alert"
import InterviewCard from "../components/interviews/InterviewCard"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    avgScore: "N/A",
    lastInterview: "N/A",
  })

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get("/api/interviews")
        setInterviews(res.data)

        // Calculate stats
        const total = res.data.length
        const completed = res.data.filter((interview) => interview.status === "completed").length

        // Set stats
        setStats({
          total,
          completed,
          avgScore: completed > 0 ? "Coming soon" : "N/A",
          lastInterview: total > 0 ? new Date(res.data[0].createdAt).toLocaleDateString() : "N/A",
        })

        setLoading(false)
      } catch (err) {
        setError("Failed to fetch interviews")
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || "User"}</h1>
          <Link to="/new-interview" className="btn btn-primary">
            New Interview
          </Link>
        </div>

        {error && <Alert type="error" message={error} />}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Interviews</h3>
            <p className="stat-value">{stats.total}</p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>

          <div className="stat-card">
            <h3>Average Score</h3>
            <p className="stat-value">{stats.avgScore}</p>
          </div>

          <div className="stat-card">
            <h3>Last Interview</h3>
            <p className="stat-value">{stats.lastInterview}</p>
          </div>
        </div>

        <div className="dashboard-content">
          <h2>Your Interviews</h2>

          {loading ? (
            <div className="loading-container">Loading interviews...</div>
          ) : interviews.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any interviews yet.</p>
              <Link to="/new-interview" className="btn btn-primary">
                Start Your First Interview
              </Link>
            </div>
          ) : (
            <div className="interviews-grid">
              {interviews.map((interview) => (
                <InterviewCard key={interview._id} interview={interview} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

