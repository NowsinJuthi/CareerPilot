const express = require("express");
const router = express.Router();

const {
  startInterview,
  continueInterview,
  getCurrentInterview,
  finishInterview,
} = require("../controllers/interview.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/start", authMiddleware, startInterview);

router.post("/answer", authMiddleware, continueInterview);

router.get("/current", authMiddleware, getCurrentInterview);

router.post("/finish", authMiddleware, finishInterview);

module.exports = router;