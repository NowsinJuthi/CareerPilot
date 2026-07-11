const Interview = require("../models/interview.model");
const ollamaService = require("./ollama.service");

// Start Interview
const startInterview = async (userId, role) => {
  const prompt = `
You are a professional software engineering interviewer.

Role: ${role}

Generate ONLY ONE interview question.

Rules:
- Don't greet.
- Don't explain.
- Ask only one question.
`;

  const question = await ollamaService.chat([
    {
      role: "system",
      content: "You are a senior technical interviewer.",
    },
    {
      role: "user",
      content: prompt,
    },
  ]);

  const interview = await Interview.create({
    user: userId,
    role,
    currentQuestion: 1,
    questions: [
      {
        question,
      },
    ],
  });

  return {
    interviewId: interview._id,
    question,
  };
};

// Continue Interview
const continueInterview = async (
  interviewId,
  answer
) => {
  const interview = await Interview.findById(interviewId);

  if (!interview) {
    throw new Error("Interview not found");
  }

  const currentIndex =
    interview.currentQuestion - 1;

  interview.questions[currentIndex].answer =
    answer;

  // Previous Questions

  const previousQuestions =
    interview.questions
      .map((q) => q.question)
      .join("\n");

  // Evaluate Answer

  const feedbackPrompt = `
Question:

${interview.questions[currentIndex].question}

Answer:

${answer}

Evaluate the answer.

Return JSON.

{
"feedback":"",
"score":8
}
`;

  const feedbackResponse =
    await ollamaService.chat(
      [
        {
          role: "system",
          content:
            "You are a senior interviewer.",
        },
        {
          role: "user",
          content: feedbackPrompt,
        },
      ],
      "json"
    );

  const evaluation =
    JSON.parse(feedbackResponse);

  interview.questions[currentIndex].feedback =
    evaluation.feedback;

  interview.questions[currentIndex].score =
    evaluation.score;

  // Next Question

  const nextPrompt = `
Role:

${interview.role}

Already Asked:

${previousQuestions}

Rules

Never repeat questions.

Generate ONLY ONE NEW question.
`;

  const nextQuestion =
    await ollamaService.chat([
      {
        role: "system",
        content:
          "You are a technical interviewer.",
      },
      {
        role: "user",
        content: nextPrompt,
      },
    ]);

  interview.questions.push({
    question: nextQuestion,
  });

  interview.currentQuestion++;

  await interview.save();

  return {
    feedback:
      evaluation.feedback,

    score:
      evaluation.score,

    nextQuestion,
  };
};

module.exports = {
  startInterview,
  continueInterview,
};