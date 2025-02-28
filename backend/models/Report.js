const mongoose = require("mongoose")

const QuestionFeedbackSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
})

const ImprovedAnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  originalAnswer: {
    type: String,
    required: true,
  },
  improvedAnswer: {
    type: String,
    required: true,
  },
})

const ReportSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    areasOfImprovement: {
      type: [String],
      default: [],
    },
    grammaticalImprovements: {
      type: [String],
      default: [],
    },
    technicalImprovements: {
      type: [String],
      default: [],
    },
    questionFeedback: [QuestionFeedbackSchema],
    improvedAnswers: [ImprovedAnswerSchema],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Report", ReportSchema)

