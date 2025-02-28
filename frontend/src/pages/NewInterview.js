"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import AuthContext from "../context/AuthContext"
import Navbar from "../components/layout/Navbar"
import Alert from "../components/ui/Alert"

const NewInterview = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    jobTitle: "",
    yearsOfExperience: "",
    keySkills: "",
    targetRole: "",
    industryFocus: "",
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { jobTitle, yearsOfExperience, keySkills, targetRole, industryFocus } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check if file is PDF
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file")
        setResumeFile(null)
        setFileName("")
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB")
        setResumeFile(null)
        setFileName("")
        return
      }

      setResumeFile(file)
      setFileName(file.name)
      setError("")
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!resumeFile) {
      setError("Please upload your resume")
      return
    }

    if (!jobTitle || !yearsOfExperience || !keySkills || !targetRole || !industryFocus) {
      setError("All fields are required")
      return
    }

    // Create form data for file upload
    const formDataToSend = new FormData()
    formDataToSend.append("resume", resumeFile)
    formDataToSend.append("jobTitle", jobTitle)
    formDataToSend.append("yearsOfExperience", yearsOfExperience)
    formDataToSend.append("keySkills", keySkills)
    formDataToSend.append("targetRole", targetRole)
    formDataToSend.append("industryFocus", industryFocus)

    try {
      setLoading(true)

      const res = await axios.post("/api/interviews", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setLoading(false)

      // Redirect to the interview session
      navigate(`/interview/${res.data.interviewId}`)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Failed to create interview")
    }
  }

  return (
    <div className="new-interview-page">
      <Navbar />

      <div className="container">
        <div className="page-header">
          <h1>New Interview Session</h1>
          <p>Upload your resume and provide some information to customize your interview experience</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <div className="interview-form-card">
          <form onSubmit={onSubmit}>
            <div className="form-section">
              <h2>Resume Upload</h2>

              <div className="file-upload-container">
                <label htmlFor="resume" className="file-upload-label">
                  <div className="file-upload-icon">
                    <i className="fas fa-file-upload"></i>
                  </div>
                  <div className="file-upload-text">
                    {fileName ? fileName : "Click to upload PDF"}
                    <p className="file-upload-help">Max file size: 5MB</p>
                  </div>
                </label>
                <input type="file" id="resume" onChange={onFileChange} accept=".pdf" className="file-upload-input" />
              </div>
            </div>

            <div className="form-section">
              <h2>Professional Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jobTitle">Current Job Title</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={jobTitle}
                    onChange={onChange}
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="yearsOfExperience">Years of Experience</label>
                  <select
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={yearsOfExperience}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="keySkills">Key Skills</label>
                <textarea
                  id="keySkills"
                  name="keySkills"
                  value={keySkills}
                  onChange={onChange}
                  placeholder="e.g. JavaScript, React, Node.js, Project Management"
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="targetRole">Target Role</label>
                  <input
                    type="text"
                    id="targetRole"
                    name="targetRole"
                    value={targetRole}
                    onChange={onChange}
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="industryFocus">Industry Focus</label>
                  <select id="industryFocus" name="industryFocus" value={industryFocus} onChange={onChange} required>
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? "Processing..." : "Start Interview"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewInterview

