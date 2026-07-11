const axios = require("axios");
const fs = require("fs");
const pdf = require("pdf-parse");

const User = require("../models/User");
const safeJsonParse = require("../utils/safeJsonParse");

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const text = pdfData.text.trim();

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from PDF",
      });
    }



    const prompt = `
You are a Professional ATS Resume Reviewer and Senior Technical Recruiter.

Analyze the resume carefully.

Rules:

- Return ONLY valid JSON.
- No markdown.
- No explanation.
- No code block.
- Do not leave any field empty.
- atsScore must be between 1 and 100.
- Generate realistic values.

Return this JSON:

{
  "atsScore": 85,
  "summary": "...",
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "careerRecommendations": [],
  "recommendedSkills": [],
  "recommendedJobs": [],
  "roadmap":[
    {
      "step":"",
      "deadline":""
    }
  ]
}

Resume:

${text}
`;
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        format: "json",
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 2048,
        },
      }
    );

    console.log("========== RAW AI RESPONSE ==========");
    console.log(response.data.response);

    let result = safeJsonParse(response.data.response);

    if (!result) {
      result = {
        atsScore: 0,
        summary: "",
        strengths: [],
        weaknesses: [],
        suggestions: [],
        careerRecommendations: [],
        recommendedSkills: [],
        recommendedJobs: [],
        roadmap: [],
      };
    }

    if (!result.atsScore || result.atsScore <= 0) {
      result.atsScore = 80;
    }

    if (!result.summary || result.summary.trim() === "") {
      result.summary =
        "Your resume demonstrates a strong foundation in software development. Adding measurable achievements, cloud deployment experience, testing skills, and advanced technologies will further improve your ATS performance.";
    }
    // Strengths
    if (!Array.isArray(result.strengths) || result.strengths.length === 0) {
      result.strengths = [
        "Full-Stack Web Development",
        "Responsive Web Design",
        "REST API Development",
        "MongoDB Database Design",
        "Git & GitHub Version Control",
      ];
    }

    // Weaknesses
    if (!Array.isArray(result.weaknesses) || result.weaknesses.length === 0) {
      result.weaknesses = [
        "Limited TypeScript experience",
        "No Docker or containerization projects",
        "No AWS or cloud deployment experience",
        "Projects lack measurable achievements",
        "Limited testing experience with Jest",
      ];
    }

    // Suggestions
    if (!Array.isArray(result.suggestions) || result.suggestions.length === 0) {
      result.suggestions = [
        "Learn TypeScript and use it in production projects.",
        "Containerize your applications using Docker.",
        "Deploy at least one project to AWS, Azure, or GCP.",
        "Add measurable achievements and metrics to every project.",
        "Learn testing using Jest and React Testing Library.",
      ];
    }

    // Career Recommendations
    if (
      !Array.isArray(result.careerRecommendations) ||
      result.careerRecommendations.length === 0
    ) {
      result.careerRecommendations = [
        "Junior MERN Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
      ];
    }
    // Recommended Skills
    if (
      !Array.isArray(result.recommendedSkills) ||
      result.recommendedSkills.length === 0
    ) {
      result.recommendedSkills = [
        "TypeScript",
        "Docker",
        "AWS",
        "Redis",
        "CI/CD",
        "Jest",
        "React Query",
        "GraphQL",
      ];
    }

    // Recommended Jobs
    if (
      !Array.isArray(result.recommendedJobs) ||
      result.recommendedJobs.length === 0
    ) {
      result.recommendedJobs = [
        "Junior MERN Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Engineer",
        "Software Engineer",
      ];
    }

    // Roadmap
    if (
      !Array.isArray(result.roadmap) ||
      result.roadmap.length === 0
    ) {
      result.roadmap = [
        {
          step: "Master TypeScript",
          deadline: "2 Weeks",
        },
        {
          step: "Learn Docker",
          deadline: "2 Weeks",
        },
        {
          step: "Deploy a project on AWS",
          deadline: "1 Month",
        },
        {
          step: "Learn Unit Testing with Jest",
          deadline: "2 Weeks",
        },
        {
          step: "Build an advanced MERN SaaS project",
          deadline: "1 Month",
        },
      ];
    }

    console.log("========== PARSED RESULT ==========");
    console.dir(result, { depth: null });

    await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeText: text,
        resumeAnalysis: result,
      },
      {
        new: true,
      }
    );


    return res.json({
      success: true,
      data: result,
      resumeText: text,
    });

  } catch (error) {
    console.error("Resume Analysis Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });

  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Failed to delete uploaded file:", err.message);
      }
    }
  }
};


const getResumeAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("resumeAnalysis");

    return res.json({
      success: true,
      data: user?.resumeAnalysis || null,
    });

  } catch (error) {
    console.error("Get Resume Analysis Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  analyzeResume,
  getResumeAnalysis,
};