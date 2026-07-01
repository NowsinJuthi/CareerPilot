require("dotenv").config();

const express = require("express");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const cookieParser = require("cookie-parser");

app.use(cookieParser()); // MUST be before routes

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();