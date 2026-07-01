const OpenAI = require("openai");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const safeJsonParse = require("../utils/safeJson.js");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});






const analyzeResume = async (req, res) => {
  try {

    // STEP 1: Get uploaded file
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }


    const aiResponse = await callAI(file); 

    // STEP 3: SAFE JSON PARSE
    const result = safeJsonParse(aiResponse);

    // STEP 4: RETURN SAFE OUTPUT
    return res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "AI processing failed",
      error: error.message,
    });
  }
};



module.exports = {
  analyzeResume,
};