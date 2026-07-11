const safeJsonParse = (text) => {
  try {
    if (!text) {
      return null;
    }

    let cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // JSON object-এর প্রথম { এবং শেষ } খুঁজে বের করো
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON found");
    }

    cleaned = cleaned.substring(firstBrace, lastBrace + 1);

    return JSON.parse(cleaned);

  } catch (err) {
    console.error("JSON Parse Error:", err);

    return null;
  }
};

module.exports = safeJsonParse;