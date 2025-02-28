"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/layout/Navbar"
import Alert from "../components/ui/Alert"
import ProgressBar from "../components/ui/ProgressBar"

const InterviewSession = () => {
  const params = useParams()
  const navigate = useNavigate()
  const interviewId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [progress, setProgress] = useState(0)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Fetch interview questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`/api/interviews/${interviewId}/questions`)
        setQuestions(res.data.questions)
        setProgress(0)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch interview questions")
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [interviewId])

  // Calculate progress
  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100)
    }
  }, [currentQuestionIndex, questions])

  // Speech synthesis for asking questions
  const speakQuestion = useCallback((text) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => {
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    } else {
      setError("Speech synthesis is not supported in your browser")
    }
  }, [])

  // Speak current question when it changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      speakQuestion(questions[currentQuestionIndex].text)
    }
  }, [currentQuestionIndex, questions, speakQuestion])

  // Start recording user's answer
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })

        // Convert audio to text using API
        const formData = new FormData()
        formData.append("audio", audioBlob)
        formData.append("questionId", questions[currentQuestionIndex].id)

        try {
          const res = await axios.post(`/api/interviews/${interviewId}/answers`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })

          setTranscript(res.data.transcript)

          // Move to next question after a short delay
          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1)
              setTranscript("")
            } else {
              // Interview completed
              navigate(`/interview/${interviewId}/report`)
            }
          }, 2000)
        } catch (err) {
          setError(err.response?.data?.message || "Failed to process your answer")
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setError("Microphone access denied or not available")
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  if (loading) {
    return (
      <div className="interview-session-page">
        <Navbar />
        <div className="loading-container">Loading interview questions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="interview-session-page">
        <Navbar />
        <div className="container">
          <Alert type="error" message={error} />
          <button className="btn btn-primary mt-4" onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="interview-session-page">
      <Navbar />

      <div className="container">
        <div className="interview-header">
          <h1>Interview Session</h1>
          <ProgressBar value={progress} />
          <p className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="interview-card">
          <div className="speaking-indicator">
            {isSpeaking ? (
              <div className="speaking-active">
                <i className="fas fa-volume-up"></i>
                <span>AI is speaking...</span>
              </div>
            ) : (
              <div className="speaking-inactive">
                <i className="fas fa-volume-mute"></i>
                <span>AI is silent</span>
              </div>
            )}
          </div>

          <div className="question-container">
            <h2 className="question-text">{questions[currentQuestionIndex]?.text || "No question available"}</h2>
          </div>

          {transcript && (
            <div className="transcript-container">
              <h3>Your answer:</h3>
              <p>{transcript}</p>
            </div>
          )}
        </div>

        <div className="recording-controls">
          {isRecording ? (
            <button className="btn btn-danger btn-lg recording-btn" onClick={stopRecording}>
              <i className="fas fa-microphone-slash"></i>
              Stop Recording
            </button>
          ) : (
            <button className="btn btn-primary btn-lg recording-btn" onClick={startRecording} disabled={isSpeaking}>
              <i className="fas fa-microphone"></i>
              Start Recording
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterviewSession

