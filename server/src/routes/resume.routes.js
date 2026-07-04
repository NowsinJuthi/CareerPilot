const express = require("express");
const multer = require("multer");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { analyzeResume } = require("../controllers/resume.controller");

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),
  analyzeResume
);

module.exports = router;