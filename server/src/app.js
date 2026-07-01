const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes.js");
const resumeRoutes = require("./routes/resume.routes");


const app = express();

const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);



app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CareerPilot AI API Running 🚀",
  });
});


// Auth Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/resume", resumeRoutes);



module.exports = app;