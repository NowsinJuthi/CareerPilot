const axios = require("axios");

const careerRecommendation = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required",
      });
    }

    const prompt = `
You are an expert career advisor AI.

Analyze this resume and give:
1. Skills
2. Weaknesses
3. Career suggestions
4. ATS score (0-100)

Resume:
${text}

Return in simple text or JSON format.
`;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: prompt,
      stream: false,
    });

    return res.json({
      success: true,
      data: response.data.response,
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "AI service failed",
    });
  }
};

module.exports = {
  careerRecommendation,
};