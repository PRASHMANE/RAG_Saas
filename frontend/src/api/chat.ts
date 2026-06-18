import api from "./axios";

export const askQuestion = async (
  question: string
) => {
  const response = await api.post("/chat/", {
    question,
    groq_api_key: localStorage.getItem("groq_api_key"),
  });

  return response.data;
};