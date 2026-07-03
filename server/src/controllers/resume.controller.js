const fs = require("fs");
const axios = require("axios");
const PDFParser = require("pdf2json");

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    // ---------------- PDF TO TEXT ----------------
    const pdfParser = new PDFParser();

    const text = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err) => reject(err));
      pdfParser.on("pdfParser_dataReady", () => {
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText);
      });

      pdfParser.loadPDF(req.file.path);
    });

    // ---------------- OLLAMA CALL ----------------
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: `
You are an AI Resume Analyzer.

Analyze this resume and return ONLY valid JSON.

Resume:
${text}

Return format:
{
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "jobMatches": []
}

No explanation. Only JSON.
        `,
        stream: false,
      }
    );

    const resultText = response.data.response;

    return res.json({
      success: true,
      data: JSON.parse(resultText),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { analyzeResume };