const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
  careerRecommendation,
} = require("../controllers/ai.controller");

// AI Career Recommendation (User + Admin)
router.post(
  "/career-recommendation",
  authMiddleware,
  careerRecommendation
);

module.exports = router;