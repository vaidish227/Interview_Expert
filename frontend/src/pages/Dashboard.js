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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name || "User"}</h1>
          <Link to="/new-interview" className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
            New Interview
          </Link>
        </div>

        {error && <Alert type="error" message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Total Interviews</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Average Score</h3>
            <p className="text-3xl font-bold text-yellow-500">{stats.avgScore}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Last Interview</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.lastInterview}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Interviews</h2>

          {loading ? (
            <div className="text-center text-gray-600">Loading interviews...</div>
          ) : interviews.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-gray-600 mb-4">You haven't created any interviews yet.</p>
              <Link to="/new-interview" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
                Start Your First Interview
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
