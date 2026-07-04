const axios = require("axios");
const fs = require("fs");
const pdf = require("pdf-parse");

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    // Read uploaded PDF
    const dataBuffer = fs.readFileSync(req.file.path);

    // Extract text
    const pdfData = await pdf(dataBuffer);

    const text = pdfData.text.trim();

    console.log("========== RESUME TEXT ==========");
    console.log(text);
    console.log("================================");

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from PDF",
      });
    }

    const prompt = `
You are an expert ATS Resume Reviewer and Career Coach.

Analyze this resume carefully.

Return ONLY valid JSON.

{
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "careerRecommendations": [],
  "recommendedSkills": [],
  "recommendedJobs": [],
  "roadmap": []
}

Resume:

${text}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        stream: false,
      }
    );

    console.log("========== OLLAMA ==========");
    console.log(response.data.response);

    let result;

    try {
      const cleanJson = response.data.response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      result = JSON.parse(cleanJson);
    } catch (err) {
      result = {
        atsScore: 0,
        summary: response.data.response,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        careerRecommendations: [],
        recommendedSkills: [],
        recommendedJobs: [],
        roadmap: [],
      };
    }

    return res.json({
      success: true,
      data: result,
      resumeText: text,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

module.exports = {
  analyzeResume,
};