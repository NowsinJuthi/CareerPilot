const axios = require("axios");
const User = require("../models/User");
const safeJsonParse = require("../utils/safeJsonParse");

const careerRecommendation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resumeText) {
      return res.status(400).json({
        success: false,
        message: "Please analyze your resume first.",
      });
    }

    const prompt = `
You are an expert AI Career Coach.

Analyze the resume.

Return ONLY valid JSON.

Do not explain.
Do not use markdown.
Do not use code fences.

Return exactly this schema:

{
  "careerPaths":[
    {
      "name":"",
      "rating":0,
      "description":"",
      "jobs":[],
      "salaryRange":"",
      "futureDemand":"",
      "skillGaps":[],
      "recommendedSkills":[],
      "roadmap":[
        {
          "title":"",
          "duration":"",
          "description":""
        }
      ]
    }
  ]
}

Resume:

${user.resumeText}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        format: "json",
        stream: false,
        options: {
          temperature: 0,
        },
      }
    );

    const result =
      safeJsonParse(response.data.response) || {
        careerPaths: [],
      };

    await User.findByIdAndUpdate(
      req.user.id,
      {
        careerRecommendation: result,
      },
      {
        new: true,
      }
    );

    return res.json({
      success: true,
      data: result,
    });


  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getCareerRecommendation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "careerRecommendation"
    );

    return res.json({
      success: true,
      data: user?.careerRecommendation || null,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  careerRecommendation,
  getCareerRecommendation,
};