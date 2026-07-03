const safeJsonParse = (text) => {
  try {
    if (!text) return null;

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    return {
      careerPaths: [],
      raw: text,
    };
  }
};

module.exports = safeJsonParse;