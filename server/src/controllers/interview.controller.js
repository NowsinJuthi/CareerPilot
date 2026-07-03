

// Start Interview (First Question)
const startInterview = async (req, res) => {
  try {
    const { role } = req.body;

    const prompt = `
You are a professional AI interviewer.

Start a mock interview for the role: ${role}.

Give ONLY the first interview question.

No explanation, no markdown.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a strict but fair interviewer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const question = completion.choices[0].message.content;

    return res.json({
      success: true,
      question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Continue Interview (AI Feedback + Next Question)
const continueInterview = async (req, res) => {
  try {
    const { role, history } = req.body;

    const prompt = `
You are conducting a mock interview for: ${role}.

Conversation history:
${JSON.stringify(history)}

Rules:
1. Give feedback on last answer
2. Then ask NEXT question
3. Keep it short
4. Be professional

Return JSON only:

{
  "feedback": "",
  "nextQuestion": ""
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional interview coach.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = JSON.parse(
      completion.choices[0].message.content
        .replace(/```json/g, "")
        .replace(/```/g, "")
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startInterview,
  continueInterview,
};