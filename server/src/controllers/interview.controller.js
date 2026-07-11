const interviewService = require("../services/interview.service");
const Interview = require("../models/interview.model");

// START INTERVIEW
const startInterview = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || role.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const result = await interviewService.startInterview(
      req.user.id,
      role
    );

    return res.status(200).json({
      success: true,
      interviewId: result.interviewId,
      question: result.question,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CONTINUE INTERVIEW
const continueInterview = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    if (!answer || answer.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const result =
      await interviewService.continueInterview(
        interviewId,
        answer
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET CURRENT INTERVIEW
const getCurrentInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      user: req.user.id,
      status: "in_progress",
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "No active interview found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// FINISH INTERVIEW
const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview =
      await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.status = "completed";
    interview.completedAt = new Date();

    const total = interview.questions.reduce(
      (sum, q) => sum + q.score,
      0
    );

    interview.overallScore = Number(
      (
        total /
        interview.questions.length
      ).toFixed(1)
    );

    await interview.save();

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startInterview,
  continueInterview,
  getCurrentInterview,
  finishInterview,
};