const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  careerRecommendation,
  getCareerRecommendation,
} = require("../controllers/ai.controller");

router.get(
  "/career-recommendation",
  authMiddleware,
  getCareerRecommendation
);

router.post(
  "/career-recommendation",
  authMiddleware,
  careerRecommendation
);

module.exports = router;