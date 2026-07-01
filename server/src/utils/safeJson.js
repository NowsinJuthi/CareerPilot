const safeJsonParse = (text) => {
  try {
    if (!text) return null;

    // remove markdown wrappers
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    return {
      success: false,
      error: "AI returned invalid JSON",
      raw: text,
    };
  }
};

module.exports = safeJsonParse;