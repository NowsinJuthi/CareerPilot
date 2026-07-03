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

    const pdfParser = new PDFParser();

    const text = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });

      pdfParser.loadPDF(req.file.path);
    });

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: `
Analyze this resume and return ONLY JSON:

${text}

Return:
{
  "atsScore": 0,
  "summary": "",
  "skills": [],
  "weaknesses": [],
  "suggestions": []
}
        `,
        stream: false,
      }
    );

    let result;

    try {
      result = JSON.parse(response.data.response);
    } catch {
      result = { raw: response.data.response };
    }

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

module.exports = { analyzeResume };