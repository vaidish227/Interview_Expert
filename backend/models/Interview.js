const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: null,
  },
  answeredAt: {
    type: Date,
    default: null,
  },
})

const InterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      filename: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
    userInputs: {
      jobTitle: {
        type: String,
        required: true,
      },
      yearsOfExperience: {
        type: String,
        required: true,
      },
      keySkills: {
        type: String,
        required: true,
      },
      targetRole: {
        type: String,
        required: true,
      },
      industryFocus: {
        type: String,
        required: true,
      },
    },
    questions: [QuestionSchema],
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Interview", InterviewSchema)

