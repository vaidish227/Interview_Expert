"use client"

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
    if (score >= 80) return "score-high"
    if (score >= 60) return "score-medium"
    return "score-low"
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <i className="fas fa-check-circle score-icon-high"></i>
    if (score >= 60) return <i className="fas fa-exclamation-triangle score-icon-medium"></i>
    return <i className="fas fa-times-circle score-icon-low"></i>
  }

  if (loading) {
    return (
      <div className="interview-report-page">
        <Navbar />
        <div className="loading-container">Generating your interview report...</div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="interview-report-page">
        <Navbar />
        <div className="container">
          <Alert type="error" message={error || "Failed to load report"} />
          <button className="btn btn-primary mt-4" onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="interview-report-page">
      <Navbar />

      <div className="container">
        <div className="report-header">
          <h1>Interview Report</h1>
          <button className="btn btn-outline">
            <i className="fas fa-download"></i> Download PDF
          </button>
        </div>

        <div className="score-cards">
          <div className="score-card">
            <h3>Overall Score</h3>
            <p className={`score-value ${getScoreColor(report.overallScore)}`}>{report.overallScore}%</p>
          </div>

          <div className="score-card">
            <h3>Answer Accuracy</h3>
            <p className={`score-value ${getScoreColor(report.accuracy)}`}>{report.accuracy}%</p>
          </div>

          <div className="score-card">
            <h3>Areas for Improvement</h3>
            <p className="score-value">{report.areasOfImprovement.length}</p>
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
            <div className="tab-content">
              <div className="improvement-section">
                <h2>Areas of Improvement</h2>
                <ul className="improvement-list">
                  {report.areasOfImprovement.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>

              <div className="improvement-section">
                <h2>Grammatical Improvements</h2>
                <ul className="improvement-list">
                  {report.grammaticalImprovements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="improvement-section">
                <h2>Technical Improvements</h2>
                <ul className="improvement-list">
                  {report.technicalImprovements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "qa" && (
            <div className="tab-content">
              <div className="qa-list">
                {report.questionAnswers.map((qa, index) => (
                  <div key={index} className="qa-card">
                    <div className="qa-header">
                      <h3>Question {index + 1}</h3>
                      <div className="qa-score">
                        {getScoreIcon(qa.score)}
                        <span className={getScoreColor(qa.score)}>{qa.score}%</span>
                      </div>
                    </div>
                    <p className="qa-question">{qa.question}</p>
                    <div className="qa-answer">
                      <h4>Your Answer:</h4>
                      <p>{qa.answer}</p>
                    </div>
                    <div className="qa-feedback">
                      <h4>Feedback:</h4>
                      <p>{qa.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "improvements" && (
            <div className="tab-content">
              <div className="improvement-card">
                <h2>Technical Skills</h2>
                <p className="improvement-subtitle">Areas where you can improve your technical knowledge</p>
                <ul className="improvement-list">
                  {report.technicalImprovements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="improvement-card">
                <h2>Communication Skills</h2>
                <p className="improvement-subtitle">Ways to improve your communication and presentation</p>
                <ul className="improvement-list">
                  {report.grammaticalImprovements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "corrected" && (
            <div className="tab-content">
              <div className="corrected-list">
                {report.improvedAnswers.map((item, index) => (
                  <div key={index} className="corrected-card">
                    <h3>Question {index + 1}</h3>
                    <p className="corrected-question">{item.question}</p>
                    <div className="corrected-original">
                      <h4>Your Original Answer:</h4>
                      <p>{item.originalAnswer}</p>
                    </div>
                    <div className="corrected-improved">
                      <h4>Improved Answer:</h4>
                      <p>{item.improvedAnswer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Tabs>

        <div className="report-actions">
          <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/new-interview")}>
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  )
}

export default InterviewReport

