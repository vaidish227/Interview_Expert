const express = require("express")
const auth = require("../middleware/auth")
const Interview = require("../models/Interview")
const Report = require("../models/Report")
const { check, validationResult } = require("express-validator")
const pdfParse = require("pdf-parse")
const {
  generateInterviewQuestions,
  transcribeAudio,
  generateInterviewReport,
  generateImprovedAnswers,
} = require("../services/geminiService")

const router = express.Router()

// @route   POST api/interviews
// @desc    Create a new interview
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    // Check if resume file exists
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "Resume file is required" })
    }

    const { jobTitle, yearsOfExperience, keySkills, targetRole, industryFocus } = req.body

    // Validate required fields
    if (!jobTitle || !yearsOfExperience || !keySkills || !targetRole || !industryFocus) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Process PDF file
    const resumeFile = req.files.resume

    // Check file type
    if (resumeFile.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" })
    }

    // Parse PDF content
    const pdfData = await pdfParse(resumeFile.tempFilePath)
    const resumeText = pdfData.text

    // Generate interview questions using Gemini
    const questions = await generateInterviewQuestions(resumeText, {
      jobTitle,
      yearsOfExperience,
      keySkills,
      targetRole,
      industryFocus,
    })

    // Create new interview
    const interview = new Interview({
      user: req.user.id,
      resume: {
        filename: resumeFile.name,
        content: resumeText,
      },
      userInputs: {
        jobTitle,
        yearsOfExperience,
        keySkills,
        targetRole,
        industryFocus,
      },
      questions: questions.map((q) => ({
        text: q,
      })),
      status: "pending",
    })

    await interview.save()

    // Return success response
    res.status(201).json({
      message: "Interview created successfully",
      interviewId: interview._id,
    })
  } catch (err) {
    console.error("Interview creation error:", err.message)
    res.status(500).json({ message: "Server error during interview creation" })
  }
})

// @route   GET api/interviews
// @desc    Get all interviews for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .select("-resume.content -questions.answer")
      .sort({ createdAt: -1 })

    res.json(interviews)
  } catch (err) {
    console.error("Interviews fetch error:", err.message)
    res.status(500).json({ message: "Server error while fetching interviews" })
  }
})

// @route   GET api/interviews/:id
// @desc    Get interview by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    res.json(interview)
  } catch (err) {
    console.error("Interview fetch error:", err.message)
    res.status(500).json({ message: "Server error while fetching interview" })
  }
})

// @route   GET api/interviews/:id/questions
// @desc    Get questions for an interview
// @access  Private
router.get("/:id/questions", auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    // Format questions for frontend
    const questions = interview.questions.map((q) => ({
      id: q._id,
      text: q.text,
    }))

    res.json({ questions })
  } catch (err) {
    console.error("Questions fetch error:", err.message)
    res.status(500).json({ message: "Server error while fetching questions" })
  }
})

// @route   POST api/interviews/:id/answers
// @desc    Submit an answer for a question
// @access  Private
// router.post("/:id/answers", auth, async (req, res) => {
//   try {
//     // Check if audio file exists
//     if (!req.files || !req.files.audio) {
//       return res.status(400).json({ message: "Audio file is required" })
//     }

//     const { questionId } = req.body

//     if (!questionId) {
//       return res.status(400).json({ message: "Question ID is required" })
//     }

//     // Find interview
//     const interview = await Interview.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     })

//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" })
//     }

//     // Find question in the interview
//     const questionIndex = interview.questions.findIndex((q) => q._id.toString() === questionId)

//     if (questionIndex === -1) {
//       return res.status(404).json({ message: "Question not found" })
//     }

//     // Process audio file
//     const audioFile = req.files.audio

//     // Transcribe audio using Gemini
//     const transcript = await transcribeAudio(audioFile.tempFilePath)

//     // Update question with answer
//     interview.questions[questionIndex].answer = transcript
//     interview.questions[questionIndex].answeredAt = new Date()

//     // Check if all questions are answered
//     const allAnswered = interview.questions.every((q) => q.answer)
//     if (allAnswered) {
//       interview.status = "completed"
//       interview.completedAt = new Date()
//     }

//     await interview.save()

//     // Return success response
//     res.json({
//       message: "Answer recorded successfully",
//       transcript,
//     })
//   } catch (err) {
//     console.error("Answer recording error:", err.message)
//     res.status(500).json({ message: "Server error during answer recording" })
//   }
// })

// Updated route to accept text answers
router.post("/:id/answers", auth, async (req, res) => {
  try {
    const { questionId, answerText } = req.body

    if (!questionId || !answerText) {
      return res.status(400).json({ message: "Question ID and answer text are required" })
    }

    // Find the interview
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    // Find the question
    const questionIndex = interview.questions.findIndex((q) => q._id.toString() === questionId)
    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found" })
    }

    // Analyze answer using Gemini
    const analysis = await transcribeAudio(answerText)

    // Update question with analyzed answer
    interview.questions[questionIndex].answer = analysis
    interview.questions[questionIndex].answeredAt = new Date()

    // Check if all questions are answered
    const allAnswered = interview.questions.every((q) => q.answer)
    if (allAnswered) {
      interview.status = "completed"
      interview.completedAt = new Date()
    }

    await interview.save()

    res.json({
      message: "Answer recorded and analyzed successfully",
      analysis,
    })
  } catch (err) {
    console.error("Answer recording error:", err.message)
    res.status(500).json({ message: "Server error during answer recording" })
  }
})


// @route   GET api/interviews/:id/report
// @desc    Get or generate report for an interview
// @access  Private
router.get("/:id/report", auth, async (req, res) => {
  try {
    // Find interview
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    // Check if all questions are answered
    const allAnswered = interview.questions.every((q) => q.answer)
    if (!allAnswered) {
      return res.status(400).json({ message: "Not all questions have been answered" })
    }

    // Check if report already exists
    let report = await Report.findOne({ interview: interview._id })

    if (!report) {
      // Format questions and answers for Gemini
      const questionsAndAnswers = interview.questions.map((q) => ({
        question: q.text,
        answer: q.answer,
      }))

      // Generate report using Gemini
      const reportData = await generateInterviewReport(
        questionsAndAnswers,
        interview.resume.content,
        interview.userInputs,
      )

      // Generate improved answers
      const improvedAnswers = await generateImprovedAnswers(questionsAndAnswers)

      // Create new report
      report = new Report({
        interview: interview._id,
        user: req.user.id,
        overallScore: reportData.overallScore,
        accuracy: reportData.accuracy,
        areasOfImprovement: reportData.areasOfImprovement,
        grammaticalImprovements: reportData.grammaticalImprovements,
        technicalImprovements: reportData.technicalImprovements,
        questionFeedback: interview.questions.map((q, index) => ({
          question: q.text,
          answer: q.answer,
          feedback: reportData.questionFeedback[index],
          score: reportData.questionScores[index],
        })),
        improvedAnswers: improvedAnswers.map((item, index) => ({
          question: interview.questions[index].text,
          originalAnswer: interview.questions[index].answer,
          improvedAnswer: item,
        })),
      })

      await report.save()

      // Update interview with report reference
      interview.report = report._id
      await interview.save()
    }

    // Format report for frontend
    const formattedReport = {
      overallScore: report.overallScore,
      accuracy: report.accuracy,
      areasOfImprovement: report.areasOfImprovement,
      grammaticalImprovements: report.grammaticalImprovements,
      technicalImprovements: report.technicalImprovements,
      questionAnswers: report.questionFeedback.map((qf) => ({
        question: qf.question,
        answer: qf.answer,
        feedback: qf.feedback,
        score: qf.score,
      })),
      improvedAnswers: report.improvedAnswers.map((ia) => ({
        question: ia.question,
        originalAnswer: ia.originalAnswer,
        improvedAnswer: ia.improvedAnswer,
      })),
    }

    // Return report
    res.json(formattedReport)
  } catch (err) {
    console.error("Report generation error:", err.message)
    res.status(500).json({ message: "Server error during report generation" })
  }
})

module.exports = router

