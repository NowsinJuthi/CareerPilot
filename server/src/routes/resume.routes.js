const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  analyzeResume,
  getResumeAnalysis,
} = require("../controllers/resume.controller");

router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),
  analyzeResume
);

router.get(
  "/analysis",
  authMiddleware,
  getResumeAnalysis
);

module.exports = router;