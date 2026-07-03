const express = require("express");
const router = express.Router();

const {
  startInterview,
  continueInterview,
} = require("../controllers/interview.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Start interview
router.post("/start", authMiddleware, startInterview);

// Continue interview
router.post("/continue", authMiddleware, continueInterview);

module.exports = router;