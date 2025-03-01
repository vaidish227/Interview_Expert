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

  const utteranceRef = useRef(null)
  const recognitionRef = useRef(null)

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

  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100)
    }
  }, [currentQuestionIndex, questions])

  const speakQuestion = useCallback((text) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setError("Speech synthesis is not supported in your browser")
    }
  }, [])

  const stopSpeaking = () => {
    if (utteranceRef.current && isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      speakQuestion(questions[currentQuestionIndex].text)
    }
  }, [currentQuestionIndex, questions, speakQuestion])

  const startRecording = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + event.results[i][0].transcript + " ")
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }
      }

      recognition.start()
      setIsRecording(true)
      recognitionRef.current = recognition
    } else {
      setError("Speech recognition is not supported in your browser")
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const clearText = () => {
    setTranscript("")
  }

  const sendAnswer = async () => {
    try {
      await axios.post(`/api/interviews/${interviewId}/answers`, {
        questionId: questions[currentQuestionIndex].id,
        answerText: transcript,
      })

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setTranscript("")
      } else {
        navigate(`/interview/${interviewId}/report`)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit your answer")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-lg font-semibold">Loading interview questions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        <Alert type="error" message={error} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4" onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Interview Session</h1>
          <ProgressBar value={progress} />
          <p className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-lg">
          <div className="text-xl font-semibold mb-4">
            {questions[currentQuestionIndex]?.text || "No question available"}
          </div>
          <textarea
            className="w-full p-3 border rounded-lg"
            rows="4"
            value={transcript}
            placeholder="Start speaking to see your answer..."
            readOnly
          ></textarea>
          <div className="flex gap-4 mt-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={clearText}>
              Clear Text
            </button>
            {isRecording ? (
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={stopRecording}>
                Stop Recording
              </button>
            ) : (
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={startRecording} disabled={isSpeaking}>
                Start Recording
              </button>
            )}
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={sendAnswer} disabled={!transcript}>
              Send Answer
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={stopSpeaking}>
              Stop AI
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewSession

