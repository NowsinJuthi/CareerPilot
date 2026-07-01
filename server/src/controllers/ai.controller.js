const OpenAI = require("openai");
const User = require("../models/User");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================
// Career Recommendation AI
// ============================
const careerRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const prompt = `
You are a professional AI career advisor.

User Profile:
- Name: ${user.fullName}
- Education: ${user.education}
- Skills: ${user.skills.join(", ")}
- Interests: ${user.interests.join(", ")}
- Career Goal: ${user.careerGoal}

Task:
1. Suggest top 5 career paths (with rating out of 5 stars)
2. Provide learning roadmap step by step
3. Identify skill gaps
4. Suggest 3 job titles for each career path
5. Keep response structured and easy to read
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI career advisor.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      message: "Career recommendation generated successfully",
      data: aiResponse,
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
};