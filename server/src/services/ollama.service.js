const axios = require("axios");

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "llama3:latest";

const chat = async (messages, format = "") => {
  const body = {
    model: MODEL,
    messages,
    stream: false,
  };

  if (format) {
    body.format = format;
  }

  const response = await axios.post(OLLAMA_URL, body);

  return response.data.message.content;
};

module.exports = {
  chat,
};