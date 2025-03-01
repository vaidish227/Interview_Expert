import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/layout/Navbar"
import Alert from "../components/ui/Alert"
import Tabs from "../components/ui/Tabs"

const InterviewReport = () => {
  const params = useParams()
  const navigate = useNavigate()
  const interviewId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [report, setReport] = useState(null)
  const [activeTab, setActiveTab] = useState("summary")

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`/api/interviews/${interviewId}/report`)
        setReport(res.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch interview report")
        setLoading(false)
      }
    }

    fetchReport()
  }, [interviewId])

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Navbar />
        <div className="text-lg font-semibold">Generating your interview report...</div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-6">
          <Alert type="error" message={error || "Failed to load report"} />
          <button className="btn btn-primary mt-4" onClick={() => navigate("/dashboard")}>Return to Dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Interview Report</h1>
          <button className="btn btn-outline">
            <i className="fas fa-download"></i> Download PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold">Overall Score</h3>
            <p className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>{report.overallScore}%</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold">Answer Accuracy</h3>
            <p className={`text-3xl font-bold ${getScoreColor(report.accuracy)}`}>{report.accuracy}%</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold">Areas for Improvement</h3>
            <p className="text-3xl font-bold">{report.areasOfImprovement.length}</p>
          </div>
        </div>

        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "summary", label: "Summary" },
            { id: "qa", label: "Questions & Answers" },
            { id: "improvements", label: "Improvements" },
            { id: "corrected", label: "Corrected Answers" },
          ]}
        >
          {activeTab === "summary" && (
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Areas of Improvement</h2>
              <ul className="list-disc pl-6">
                {report.areasOfImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "qa" && (
            <div className="space-y-6">
              {report.questionAnswers.map((qa, index) => (
                <div key={index} className="bg-white p-6 shadow rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Question {index + 1}</h3>
                  <p className="text-gray-700 mb-4">{qa.question}</p>
                  <h4 className="font-semibold">Your Answer:</h4>
                  <p className="text-gray-600 mb-4">{qa.answer}</p>
                  <h4 className="font-semibold">Feedback:</h4>
                  <p className="text-gray-600">{qa.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </Tabs>

        <div className="flex justify-between mt-6">
          <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          <button className="btn btn-primary" onClick={() => navigate("/new-interview")}>Start New Interview</button>
        </div>
      </div>
    </div>
  )
}

export default InterviewReport

// Let me know if you want me to tweak anything else! 🚀
