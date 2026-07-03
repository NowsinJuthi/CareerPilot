const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { analyzeResume } = require("../controllers/resume.controller");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// 🔥 PROTECTED ROUTE
router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),
  analyzeResume
);

module.exports = router;