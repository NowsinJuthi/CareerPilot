const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware.js");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get Current User (Protected)
router.get("/me", authMiddleware, getMe);

// Logout (Protected)
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;