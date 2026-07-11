const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },

    topic: {
      type: String,
      default: "",
    },

    timeTaken: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    currentQuestion: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    technicalScore: {
      type: Number,
      default: 0,
    },

    problemSolvingScore: {
      type: Number,
      default: 0,
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    questions: [questionSchema],

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);